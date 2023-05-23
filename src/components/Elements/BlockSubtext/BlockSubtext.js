import React from "react";

const BlockSubtext = (props) => {
  return (
    <div
      {...props.attributes}
      style={{
        fontWeight: "normal",
        fontSize: "14px",
        color: "#717171",
        lineHeight: "20px",
      }}
    >
      {props.children}
    </div>
  );
};

export default BlockSubtext;
