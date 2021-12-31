import type { BrowserJsPlumbInstance } from "@jsplumb/browser-ui";
import type {
  INode,
  ITableDefinition,
  ITransformDefinition,
  IFlowDefinition,
} from "../types";
import {
  currentFlowStore,
  jsPlumbInstanceStore,
  refreshStore,
} from "../canvasStore";
import { safeid } from "./safeid";
import { tick } from "svelte";
import { Resource } from "../../services/client";

let currentFlow: IFlowDefinition;
let jsPlumbInstance: BrowserJsPlumbInstance;
let isPanning: boolean = false;

currentFlowStore.subscribe((flow) => {
  currentFlow = flow;
});

jsPlumbInstanceStore.subscribe((value) => {
  jsPlumbInstance = value;
  console.debug("jsPlumbInstance refreshed!");
});

export async function compileCurrentFlow() {
  console.debug("compiling flow...");
  const client = Resource("http://localhost:8321", "flow/compile");
  const response = await client.create(currentFlow).then((r) => r.json());
  console.debug(response);
}

export async function loadFlow(flow: IFlowDefinition) {
  jsPlumbInstance.deleteEveryConnection();
  refreshStore.set(flow.id);
  await tick();
  currentFlowStore.set(flow);
  await tick();
  jsPlumbInstance.repaintEverything();
  console.debug(currentFlow.edges);
  currentFlow.edges.forEach((edge) => {
    if (
      jsPlumbInstance.connections.filter((c) => {
        return c.sourceId === edge.source && c.targetId === edge.target;
      }).length < 1
    ) {
      const sourceElement = document.getElementById(edge.source);
      const sourceEndpoint = jsPlumbInstance
        .getEndpoints(sourceElement)
        .find((ep) => {
          return ep.isSource === true;
        });
      const targetElement = document.getElementById(edge.target);
      const targetEndpoint = jsPlumbInstance
        .getEndpoints(targetElement)
        .find((ep) => {
          return ep.isTarget === true;
        });
      jsPlumbInstance.connect({
        source: sourceEndpoint,
        target: targetEndpoint,
      });
    }
  });
  jsPlumbInstance.repaintEverything();
}

export function addNode(newNode: INode) {
  let id = newNode.id || safeid();
  currentFlowStore.set({
    ...currentFlow,
    nodes: [...currentFlow.nodes, { id, ...newNode }],
  });
}

export function addTable() {
  const newTable: ITableDefinition = {
    name: `table_${safeid(6)}`,
    schema: "",
    database: "",
    materialised: false,
    columns: [],
  };
  addNode({ ...newTable, type: "table" } as INode);
}

export function addTransform() {
  const newTransform: ITransformDefinition = {
    transform: "{col}",
    filter: "1=1",
  };
  addNode({ ...newTransform, type: "transform" } as INode);
}

export function setZoom(zoom: number, transformOrigin = [0.0, 0.0]) {
  let el = jsPlumbInstance.getContainer();
  let s = `scale(${zoom})`;
  let oString = transformOrigin[0] + "% " + transformOrigin[1] + "%";

  el.style["transform"] = s;
  el.style["transformOrigin"] = oString;
  el.style["height"] = 100 / zoom + "%";
  el.style["width"] = 100 / zoom + "%";

  jsPlumbInstance.setZoom(zoom, true);
}

export function panElements(
  el: HTMLDivElement,
  deltaX: number,
  deltaY: number
) {
  Array.from(el.children as HTMLCollectionOf<HTMLElement>).forEach((child) => {
    const style = getComputedStyle(child);
    const top = parseInt(style["top"]) | 0;
    const left = parseInt(style["left"]) | 0;
    child.style["left"] = `${left + deltaX}px`;
    child.style["top"] = `${top + deltaY}px`;
  });
}

export function handlePanning(event: MouseEvent) {
  let el: HTMLDivElement = jsPlumbInstance.getContainer();
  let deltaX = (event.x - currentFlow.pan.x) * (1 / currentFlow.zoom);
  let deltaY = (event.y - currentFlow.pan.y) * (1 / currentFlow.zoom);
  if (isPanning === false) {
    [deltaX, deltaY] = [0, 0];
  }
  currentFlow.pan = { x: event.x, y: event.y };
  panElements(el, deltaX, deltaY);
  jsPlumbInstance.repaintEverything();
  isPanning = true;
}

export function handleEndPan() {
  isPanning = false;
}

export function handleScroll(event: WheelEvent) {
  if (event.deltaY > 0) {
    currentFlow.zoom -= 0.025;
  } else if (event.deltaY < 0) {
    currentFlow.zoom += 0.025;
  }
  currentFlow.zoom = Math.min(Math.max(0.25, currentFlow.zoom), 2);
  setZoom(currentFlow.zoom);
}
