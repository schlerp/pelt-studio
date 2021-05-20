import React, { memo } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import TransformIcon from "@material-ui/icons/Transform";
import Grid from "@material-ui/core/Grid";
import { Handle } from "react-flow-renderer";
import { FormGroup } from "@material-ui/core";

export default memo(({ data, id }) => {
  const selectTooltipText =
    'This field replaces the column in the ETL select statement. Use "{{ col }}" as a place holder for the input column. Ensure this field contains a valid SQL fragment.';
  const whereTooltipText =
    'This field is added to the where clause of the ETL select statement. Use "{{ col }}" as a place holder for the input column. Ensure this field contains a valid SQL fragment.';

  return (
    <div className="node nodetransform">
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
      >
        <TransformIcon />
        <Typography variant="subtitle2">Transformation</Typography>
        <Grid item />
      </Grid>
      <FormGroup className="formgroup">
        <Tooltip title={selectTooltipText} enterDelay={500} leaveDelay={200}>
          <TextField
            className="nodeinput code"
            id={`${data.name}TransformInput`}
            label="transform"
            variant="outlined"
            size="small"
            onChange={(e) => data.onChange(e, id, "transform")}
            defaultValue={data.transform}
            multiline
            rows={1}
            rowsMax={3}
          />
        </Tooltip>
        <Tooltip title={whereTooltipText} enterDelay={500} leaveDelay={200}>
          <TextField
            className="nodeinput code"
            id={`${data.name}FilterInput`}
            label="filter"
            variant="outlined"
            size="small"
            onChange={(e) => data.onChange(e, id, "filter")}
            defaultValue={data.filter}
            multiline
            rows={1}
            rowsMax={3}
          />
        </Tooltip>
      </FormGroup>
      <Handle type="target" position="left" id={`${data.label}HandleTarget`} />
      <Handle type="source" position="right" id={`${data.label}HandleSource`} />
    </div>
  );
});
