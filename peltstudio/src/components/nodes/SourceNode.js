import React, { memo } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputIcon from "@material-ui/icons/Input";
import Grid from "@material-ui/core/Grid";
import { FormGroup } from "@material-ui/core";

import { Handle } from "react-flow-renderer";

export const SourceNode = memo(({ data, id }) => {
  const fullName = `${data.table}.${data.name}`;
  return (
    <div className="node nodesource">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <InputIcon />
        <Typography variant="subtitle2">Source Column</Typography>
        <Grid item />
      </Grid>
      <FormGroup className="formgroup">
        <TextField
          className="nodeinput code"
          id={`${fullName}FilterInput`}
          label="column"
          variant="outlined"
          size="small"
          value={fullName}
          disabled
        />
      </FormGroup>
      <Handle type="source" position="right" id={`${fullName}Handle`} />
    </div>
  );
});

export default SourceNode;
