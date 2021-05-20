import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

export function Sidebar(props) {
  const onDragStart = (event, nodeType, nodeColumn) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: nodeType, column: nodeColumn })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Paper elevation={3} component="aside">
      <Typography variant="h4">Operations</Typography>
      <div
        className="flownode transform"
        onDragStart={(event) =>
          onDragStart(event, "TransformNode", "{{ col }}")
        }
        draggable
      >
        Transformation
      </div>
      <Typography variant="h4">Fields</Typography>
      <div
        className="flownode staging"
        onDragStart={(event) => onDragStart(event, "StagingNode", "{{ col }}")}
        draggable
      >
        Staging Field
      </div>
      <div
        className="flownode target"
        onDragStart={(event) => onDragStart(event, "TargetNode", "{{ col }}")}
        draggable
      >
        Target Field
      </div>
      <Typography variant="h4">Test</Typography>
      <div
        className="flownode table"
        onDragStart={(event) => onDragStart(event, "TableNode", "")}
        draggable
      >
        Transformation
      </div>
      {/* <Typography variant='h4'>Sources</Typography>
            {props.data.tableColumns.map((col) => {
                return (
                    <div key={`target${col.name}`} className="flownode source" onDragStart={(event) => onDragStart(event, 'source', col.name)} draggable>
                        {col.name}
                    </div>
                )
            })} */}
      <Typography variant="h6">Instructions</Typography>
      <Typography variant="body2">
        Describe the ELT flow using the components in the side bar. Transforms
        are used to apply transformations to the data in flight. These are
        implemented as part of the SQL select Statements and as such will be
        executed against the database that the data is being selected from. In
        order to follow a true ELT (rather than ETL) staging tables must be used
        to load the data into the target database before the Transformations
        take place.
      </Typography>
    </Paper>
  );
}

export default Sidebar;
