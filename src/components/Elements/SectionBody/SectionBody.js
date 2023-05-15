import React from "react";

const SectionBody = (props) => {
  if (props.element.isCollapsed) return null;

  return (
    <div {...props.attributes}>
      <div>{props.children}</div>
    </div>
  );
};

export default SectionBody;
