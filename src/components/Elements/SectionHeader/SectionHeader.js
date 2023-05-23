import React from "react";

const SectionHeader = (props) => {
  return (
    <div
      {...props.attributes}
      style={{
        fontWeight: "500",
        fontSize: "18px",
        lineHeight: "24px",
        padding: "2px",
        marginBottom: "12px",
        background: props.element.selected
          ? "rgba(35, 131, 226, 0.14)"
          : "white",
      }}
    >
      <div>{props.children}</div>
    </div>
  );
};

export default SectionHeader;
