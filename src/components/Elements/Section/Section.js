import React from "react";
import { ArrowRight, ArrowDropDown } from "@mui/icons-material";

const iconStyle = {
  border: "1px solid #EBEBEB",
  borderRadius: "36px",
  height: "24px",
};

const Section = (props) => {
  const { attributes, children, element, collapsedIconClicked } = props;
  const isCollapsed = element.isCollapsed;
  //console.log(props);
  return (
    <div
      {...attributes}
      style={{
        display: "flex",
        columnGap: "10px",
        marginBottom: "12px",
      }}
    >
      <div
        onClick={(event) => collapsedIconClicked(event, element)}
        style={{ cursor: "pointer" }}
      >
        {!isCollapsed ? (
          <ArrowDropDown
            style={{
              ...iconStyle,
            }}
          />
        ) : (
          <ArrowRight
            style={{
              ...iconStyle,
            }}
          />
        )}
      </div>
      <div>{isCollapsed ? [children[0]] : children}</div>
    </div>
  );
};

export default Section;
