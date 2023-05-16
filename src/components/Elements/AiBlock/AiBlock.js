import React from "react";
import classes from "./AiBlock.module.css";

const AiBlock = ({ editor, element, attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{ marginBottom: "12px" }}
      className={classes.AiBlockContainer}
    >
      <div>{children}</div>
    </div>
  );
};

export default AiBlock;
