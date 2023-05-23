import React from "react";
import classes from "./AiBlock.module.css";

const AiBlock = ({ editor, element, attributes, children }) => {
  return (
    <div
      {...attributes}
      style={{
        marginBottom: "12px",
        padding: "4px 50px 4px 0px",
        background: element.selected ? "rgba(35, 131, 226, 0.14)" : "white",
      }}
      className={classes.AiBlockContainer}
    >
      <div>{children}</div>
    </div>
  );
};

export default AiBlock;
