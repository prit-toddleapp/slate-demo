import React from "react";

const BlockTitle = (props) => {
  return (
    <div
      {...props.attributes}
      style={{ fontWeight: "500", fontSize: "16px", lineHeight: "24px" }}
    >
      {props.children}
    </div>
  );
};

export default BlockTitle;
