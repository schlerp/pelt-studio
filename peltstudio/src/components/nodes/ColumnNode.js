import React, { memo, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import ViewCarouselOutlinedIcon from "@material-ui/icons/ViewCarouselOutlined";
import { Handle } from "react-flow-renderer";
import { FormGroup } from "@material-ui/core";
import DatabaseSelect from "../controls/DatabaseSelect";

export default function ColumnNode({ data, id, type }) {
  const fullName = `${data.database}.${data.schema}.${data.table}.${data.column}`;
  const [databases, setDatabases] = useState([]);
  let nodeDesc = "";
  if (type === "SourceNode") {
    nodeDesc = "Source";
  } else if (type === "TargetNode") {
    nodeDesc = "Target";
  } else if (type === "StagingNode") {
    nodeDesc = "Staging";
  }

  useEffect(
    () =>
      data.api.database
        .readall()
        .then((data) => data.json())
        .then((databases) => setDatabases(databases)),
    []
  );

  console.log(type);

  return (
    <Paper elevation={2} className="nodepaper">
      <div className="node nodestaging">
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="space-between"
        >
          <ViewCarouselOutlinedIcon />
          <Typography variant="subtitle2">{nodeDesc} Column</Typography>
          <Grid item />
        </Grid>
        <FormGroup className="formgroup">
          <FormGroup row={true}>
            <TextField
              className="nodeinputhalf code"
              id={`${fullName}TableInput`}
              label="table"
              variant="outlined"
              size="small"
              disabled={true ? type === "SourceNode" : false}
              onChange={(e) => data.onChange(e, id, "table")}
              defaultValue={data.table}
            />
            <TextField
              className="nodeinputhalf code"
              id={`${fullName}ColumnInput`}
              label="column"
              variant="outlined"
              size="small"
              disabled={true ? type === "SourceNode" : false}
              onChange={(e) => data.onChange(e, id, "name")}
              defaultValue={data.name}
            />
          </FormGroup>
          <FormGroup row={true}>
            {type !== "SourceNode" ? (
              <DatabaseSelect
                id={id}
                databases={databases}
                onChange={data.onChange}
                selectedDatabase={data.database}
              />
            ) : (
              <TextField
                className="nodeinputhalf code"
                id={`${fullName}SchemaInput`}
                label="database"
                variant="outlined"
                size="small"
                disabled={true ? type === "SourceNode" : false}
                onChange={(e) => data.onChange(e, id, "database")}
                defaultValue={data.database}
              />
            )}
            <TextField
              className="nodeinputhalf code"
              id={`${fullName}SchemaInput`}
              label="schema"
              variant="outlined"
              size="small"
              disabled={true ? type === "SourceNode" : false}
              onChange={(e) => data.onChange(e, id, "schema")}
              defaultValue={data.schema ? data.schema : "{{ default }}"}
              value={data.schema ? data.schema : "{{ default }}"}
            />
          </FormGroup>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="is_pk_checkbox"
                  onChange={(e) => data.onChange(e, id, "primary_key")}
                  disableRipple
                  color="primary"
                  checked={data.primary_key}
                  defaultChecked={data.primary_key}
                  disabled={true ? type === "SourceNode" : false}
                />
              }
              label="PK"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_nullable_checkbox"
                  onChange={(e) => data.onChange(e, id, "nullable")}
                  disableRipple
                  color="primary"
                  checked={data.nullable}
                  disabled={true ? type === "SourceNode" : false}
                />
              }
              label="Nullable"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="is_unique_checkbox"
                  onChange={(e) => data.onChange(e, id, "unique")}
                  disableRipple
                  color="primary"
                  checked={data.unique}
                  disabled={true ? type === "SourceNode" : false}
                />
              }
              label="Unique"
            />
          </Grid>
        </FormGroup>
        {type !== "SourceNode" && (
          <Handle
            type="target"
            position="left"
            id={`${fullName}HandleTarget`}
          />
        )}
        {type !== "TargetNode" && (
          <Handle
            type="source"
            position="right"
            id={`${fullName}HandleSource`}
          />
        )}
      </div>
    </Paper>
  );
}
