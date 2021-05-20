import React from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Popover from "@material-ui/core/Popover";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { Handle } from "react-flow-renderer";

export default (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      {props.columns.map((col, index) => {
        return (
          <>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              className="columngrid"
            >
              <IconButton>
                <DeleteForeverIcon />
              </IconButton>
              <TextField
                className="nodeinputgrow code"
                id={`${props.tableFullName}.${col.name}.input.name`}
                label="Column Name"
                variant="outlined"
                size="small"
                value={col.name}
                defaultValue={col.name}
              />
              <IconButton onClick={handleClick}>
                <SettingsIcon />
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
              >
                <FormGroup className="padded">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_nullable_checkbox"
                        // onChange={(e) => data.onChange(e, id, "nullable")}
                        disableRipple
                        color="primary"
                        // checked={data.nullable}
                        // disabled={true ? type === "SourceNode" : false}
                      />
                    }
                    label="Primary Key"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_nullable_checkbox"
                        // onChange={(e) => data.onChange(e, id, "nullable")}
                        disableRipple
                        color="primary"
                        // checked={data.nullable}
                        // disabled={true ? type === "SourceNode" : false}
                      />
                    }
                    label="Nullable"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_nullable_checkbox"
                        // onChange={(e) => data.onChange(e, id, "nullable")}
                        disableRipple
                        color="primary"
                        // checked={data.nullable}
                        // disabled={true ? type === "SourceNode" : false}
                      />
                    }
                    label="Unique"
                  />
                </FormGroup>
              </Popover>
            </Grid>
            <Handle
              type="target"
              position="left"
              className="tablecolhandletarget"
              id={`HandleTarget_${props.tableFullName}.${col.name}`}
              style={{ top: 172 + 66 * index }}
            />
            <Handle
              type="source"
              position="right"
              className="tablecolhandlesource"
              id={`HandleSource_${props.tableFullName}.${col.name}`}
              style={{ top: 172 + 66 * index }}
            />
          </>
        );
      })}
    </>
  );
};
