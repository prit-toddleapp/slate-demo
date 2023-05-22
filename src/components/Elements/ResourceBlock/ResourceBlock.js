import React from "react";
import classes from "./ResourceBlock.module.css";

const ResourceBlock = (props) => {
  const { element } = props;
  return (
    <div
      {...props.attributes}
      contentEditable={false}
      style={{
        background: element.selected ? "rgba(35, 131, 226, 0.14)" : "white",
      }}
      className={classes.ResourceBlockContainer}
    >
      <div style={{ color: "blue" }}>{element.iconUrl}</div>
      <div className={classes.textCotainer}>{props.children}</div>
    </div>
  );
};

export default ResourceBlock;
