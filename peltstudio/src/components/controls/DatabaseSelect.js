import React, { useState, memo } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import getId from "../../utils/IDGenerator";

export default memo((props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [database, setDatabase] = useState(props.selectedDatabase);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (event, name) => {
    setAnchorEl(null);
    setDatabase(name);
    props.onChange(event, props.id, "database");
  };

  const myId = getId();

  return (
    <FormControl className="nodeinputhalf" variant="outlined" size="small">
      <InputLabel id={`databaseSelect${props.id}`}>database</InputLabel>
      <Select
        labelId="demo-customized-select-label"
        id="demo-customized-select"
        variant="outlined"
        label="database"
        value={database}
        defaultValue={database}
        onChange={handleChange}
      >
        <MenuItem dense={true} disabled={true}>
          Select database
        </MenuItem>
        {props.databases.map((db) => (
          <MenuItem
            // onClick={(event) => handleChange(event, db.name)}
            key={`menuitem_${db.name}_${myId}`}
            dense={true}
            selected={db.name === database}
            value={db.name}
          >
            {db.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
