import React from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const DefaultElement = (props) => {
  return (
    <div {...props.attributes}>
      <AddCircleRoundedIcon />
      {props.children}
    </div>
  );
};

export default DefaultElement;
