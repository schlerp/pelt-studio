import React, { memo, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import { Handle } from "react-flow-renderer";
import { FormGroup } from "@material-ui/core";
import DatabaseSelect from "../controls/DatabaseSelect";

export default memo(({ data, id }) => {
  const fullName = `${data.table}.${data.name}`;
  const [databases, setDatabases] = useState([]);
  useEffect(
    () =>
      data.api.database
        .readall()
        .then((data) => data.json())
        .then((databases) => setDatabases(databases)),
    []
  );

  return (
    <div className="node nodestaging">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <SwapHorizIcon />
        <Typography variant="subtitle2">Staging Table Column</Typography>
        <DatabaseSelect
          id={id}
          databases={databases}
          onChange={data.onChange}
        />
      </Grid>
      <FormGroup className="formgroup">
        <TextField
          className="nodeinput code"
          id={`${fullName}ColumnInput`}
          label="column"
          variant="outlined"
          size="small"
          onChange={(e) => data.onChange(e, id, "name")}
          defaultValue={data.name}
        />
        <TextField
          className="nodeinput code"
          id={`${fullName}TableInput`}
          label="table"
          variant="outlined"
          size="small"
          onChange={(e) => data.onChange(e, id, "table")}
          defaultValue={data.table}
        />
        <TextField
          className="nodeinput code"
          id={`${fullName}SchemaInput`}
          label="schema"
          variant="outlined"
          size="small"
          onChange={(e) => data.onChange(e, id, "schema")}
          defaultValue={data.schema}
        />
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
                disableRipple={true}
              />
            }
            label="PK"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_nullable_checkbox"
                onChange={(e) => data.onChange(e, id, "nullable")}
                disableRipple={true}
              />
            }
            label="Nullable"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_unique_checkbox"
                onChange={(e) => data.onChange(e, id, "unique")}
                disableRipple={true}
              />
            }
            label="Unique"
          />
        </Grid>
      </FormGroup>
      <Handle type="target" position="left" id={`${fullName}HandleTarget`} />
      <Handle type="source" position="right" id={`${fullName}HandleSource`} />
    </div>
  );
});
