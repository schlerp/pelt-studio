import React, { memo } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

import { Handle } from "react-flow-renderer";
import { FormGroup } from "@material-ui/core";
import DatabaseSelect from "../controls/DatabaseSelect";

export default memo(({ data, id }) => {
  const fullName = `${data.table}.${data.name}`;
  return (
    <div className="node nodetarget">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <SaveAltIcon />
        <Typography variant="subtitle2">Target Table Column</Typography>
        <DatabaseSelect databases={[{ name: "derp1" }, { name: "derp2" }]} />
      </Grid>
      <FormGroup className="formgroup">
        <TextField
          className="nodeinput"
          id={`${fullName}TransformInput`}
          label="output column"
          variant="outlined"
          size="small"
          onChange={(e) => data.onChange(e, id, "name")}
          defaultValue={data.name}
        />
        <TextField
          className="nodeinput code"
          id={`${fullName}FilterInput`}
          label="table"
          variant="outlined"
          size="small"
          onChange={(e) => data.onChange(e, id, "table")}
          defaultValue={data.table}
        />
      </FormGroup>
      <Handle type="target" position="left" id={`${fullName}Handle`} />
    </div>
  );
});
