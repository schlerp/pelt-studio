import React, { memo, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Grid from "@material-ui/core/Grid";
import TableChartIcon from "@material-ui/icons/TableChart";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import DatabaseSelect from "../controls/DatabaseSelect";
import TableColumns from "./TableColumns";
import { useUpdateNodeInternals } from "react-flow-renderer";

const testTableDef = {
  name: "Person",
  schema: "derp",
  database: "test",
  columns: [
    {
      name: "id",
      datatype: "VARCHAR",
      primary_key: true,
      nullable: false,
      unique: false,
    },
    {
      name: "first_name",
      datatype: "VARCHAR",
      primary_key: false,
      nullable: false,
      unique: false,
    },
    {
      name: "last_name",
      datatype: "VARCHAR",
      primary_key: false,
      nullable: true,
      unique: false,
    },
    {
      name: "dob",
      datatype: "DATE",
      primary_key: false,
      nullable: true,
      unique: false,
    },
  ],
};

export default function TableNode({ data, id, type }) {
  const [tableDef, setTableDef] = useState(testTableDef);
  const tableFullName = `${tableDef.database}.${tableDef.schema}.${tableDef.name}`;
  const updateNodeInternals = useUpdateNodeInternals();

  function addColumn() {
    let newTableDef = {
      ...tableDef,
    };
    newTableDef["columns"] = [
      ...tableDef.columns,
      {
        name: "",
        datatype: "",
        primary_key: false,
        nullable: false,
        unique: false,
      },
    ];
    console.log(newTableDef);
    setTableDef(newTableDef);
    updateNodeInternals(id);
  }

  return (
    <Paper elevation={2} className="nodepaper">
      <div className="node nodetable">
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <TableChartIcon />
          <Typography variant="subtitle2">{tableFullName}</Typography>
          <Grid item />
        </Grid>
        <FormGroup className="formgroup">
          <FormGroup row={true}>
            <TextField
              className="nodeinput code"
              id={`${tableFullName}TableInput`}
              label="table"
              variant="outlined"
              size="small"
              // disabled={true ? type === "SourceNode" : false}
              // onChange={(e) => data.onChange(e, id, "table")}
              defaultValue={tableDef.name}
            />
          </FormGroup>
          <FormGroup row={true}>
            {type !== "SourceNode" ? (
              <DatabaseSelect
                id={id}
                databases={["derp", "derp2"]}
                // onChange={data.onChange}
                selectedDatabase={tableDef.database}
              />
            ) : (
              <TextField
                className="nodeinputhalf code"
                id={`${tableFullName}SchemaInput`}
                label="database"
                variant="outlined"
                size="small"
                // disabled={true ? type === "SourceNode" : false}
                // onChange={(e) => data.onChange(e, id, "database")}
                defaultValue={tableDef.database}
              />
            )}
            <TextField
              className="nodeinputhalf code"
              id={`${tableFullName}SchemaInput`}
              label="schema"
              variant="outlined"
              size="small"
              // disabled={true ? type === "SourceNode" : false}
              // onChange={(e) => data.onChange(e, id, "schema")}
              // defaultValue={data.schema ? data.schema : "{{ default }}"}
              // value={data.schema ? data.schema : "{{ default }}"}
            />
          </FormGroup>
        </FormGroup>
        <TableColumns
          tableFullName={tableFullName}
          columns={tableDef.columns}
        />
        <Grid>
          <Button>
            <PlaylistAddIcon onClick={addColumn} />
          </Button>
        </Grid>
      </div>
    </Paper>
  );
}
