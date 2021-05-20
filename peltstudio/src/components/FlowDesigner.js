import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import ReactFlow, {
  addEdge,
  removeElements,
  Background,
  MiniMap,
  useZoomPanHelper,
} from "react-flow-renderer";
import { getId } from "../utils/IDGenerator";

import APIClient from "./APIClient";
import TableNode from "./nodes/TableNode";
import TransformNode from "./nodes/TransformNode";
import ColumnNode from "./nodes/ColumnNode";
import Sidebar from "./Sidebar";
import FlowControls from "./FlowControls";

const nodeMap = {
  source: "SourceNode",
  target: "TargetNode",
  transform: "TransformNode",
  staging: "StagingNode",
};

const nodeTypes = {
  TargetNode: ColumnNode,
  SourceNode: ColumnNode,
  StagingNode: ColumnNode,
  TransformNode,
  TableNode,
};

const api = APIClient("http://localhost:8321");

const FlowDesigner = (props) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    api.column
      .readall()
      .then((resp) => resp.json())
      .then((data) => setColumns(data));
  }, []);

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const onConnect = (params) => setElements((els) => addEdge(params, els));
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));

  const onLoad = (_reactFlowInstance) =>
    setReactFlowInstance(_reactFlowInstance);

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onChange = (event, nodeId, fieldName) => {
    setElements((els) =>
      els.map((e) => {
        if (e.id === nodeId) {
          if (["primary_key", "nullable", "unique"].includes(fieldName)) {
            e.data[fieldName] = event.target.checked;
            console.log(event.target.checked);
          } else {
            e.data[fieldName] = event.target.value;
          }
        }
        return e;
      })
    );
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    const metadata = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    const type = metadata.type;
    const column = metadata.column;
    const uniqueId = getId();

    let nodeData = {
      onChange: onChange,
      api: api,
    };
    if (["SourceNode", "TargetNode", "StagingNode"].includes(type)) {
      // table node
      nodeData = {
        name: "{{ col }}",
        datatype: "VARCHAR(128)",
        primary_key: false,
        nullable: true,
        unique: false,
        table: uniqueId,
        table_schema: null,
        database: null,
        materialised: false,
        ...nodeData,
      };
    } else {
      // transform node
      nodeData = {
        name: uniqueId,
        transform: "{{ col }}",
        filter: "",
        ...nodeData,
      };
    }

    const newNode = {
      id: uniqueId,
      type: type,
      position,
      data: nodeData,
    };
    setElements((es) => es.concat(newNode));
  };

  const { transform } = useZoomPanHelper();

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const elements = flow.elements.map((e) => {
        delete e.data.onChange;
        delete e.data.api;
        return e;
      });
      const flowDefinition = { id: props.flowKey, ...flow };
      console.log(flowDefinition);
      const resp = api.flows.create(flowDefinition);
      resp.then((data) => console.log(data)).catch((e) => console.log(e));
    }
  }, [reactFlowInstance, props.flowKey]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const resp = api.flows.read(props.flowKey);
      resp
        .then((data) => data.json())
        .then((flow) => {
          console.log(flow);
          if (flow) {
            const [x = 0, y = 0] = flow.position;
            const elements = flow.elements.map((e) => {
              e.data = {
                ...e.data,
                onChange: onChange,
                api,
              };
              return e;
            });
            setElements(flow.elements || []);
            transform({ x, y, zoom: flow.zoom || 0 });
          }
        });
    };

    restoreFlow();
  }, [setElements, transform, props.flowKey]);

  useMemo(() => {
    if (columns.length > 0) {
      setElements((es) =>
        es.concat(
          ...columns.map((col, idx) => {
            const nodeId = getId();
            return {
              id: nodeId,
              type: "SourceNode",
              data: {
                ...col,
                onChange: onChange,
                api: api,
              },
              position: {
                x: 60,
                y: 30 + idx * 255,
              },
            };
          })
        )
      );
    }
  }, [columns]);

  return (
    <div className="flowdesigner">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          elements={elements}
          onConnect={onConnect}
          onElementsRemove={onElementsRemove}
          onLoad={onLoad}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <FlowControls onSave={onSave} onRestore={onRestore} />
          <Background variant="dots" gap={15} size={0.5} />
          <MiniMap
            nodeStrokeColor={(n) => {
              if (n.type === "SourceNode") return "#1670f7";
              if (n.type === "TargetNode") return "#ff0072";
              if (n.type === "StagingNode") return "#0c940c";
              if (n.type === "TransformNode") return "#9932cc";
            }}
            nodeColor={(n) => {
              if (n.type === "SourceNode") return "#1670f744";
              if (n.type === "TargetNode") return "#ff007244";
              if (n.type === "StagingNode") return "#0c940c44";
              if (n.type === "TransformNode") return "#9932cc44";
            }}
            nodeStrokeWidth={5}
          />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default FlowDesigner;
