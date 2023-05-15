import React from "react";

const SectionHeader = (props) => {
  return (
    <div
      {...props.attributes}
      style={{ fontWeight: "500", marginBottom: "12px" }}
    >
      <div>{props.children}</div>
    </div>
  );
};

export default SectionHeader;
