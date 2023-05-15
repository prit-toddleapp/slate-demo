import React from "react";

const Section = (props) => {
  const { attributes, children, element } = props;
  console.log(children);
  return (
    <div
      {...attributes}
      style={{ display: "flex", columnGap: "10px", marginBottom: "16px" }}
    >
      <div>
        {element.isCollapsed ? element.collapsedIcon : element.expandedIcon}
      </div>
      <div>{element.isCollapsed ? [children[0]] : children}</div>
    </div>
  );
};

export default Section;
