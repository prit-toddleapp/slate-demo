import React from "react";

const ResourceBlock = (props) => {
  const { element } = props;
  return (
    <div
      {...props.attributes}
      style={{
        display: "flex",
        marginBottom: "12px",
        columnGap: "10px",
        fontWeight: "500",
        fontSize: "16px",
      }}
    >
      <div style={{ color: "blue" }}>{element.iconUrl}</div>
      <div>{props.children}</div>
    </div>
  );
};

export default ResourceBlock;
