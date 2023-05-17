import React from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const Section = (props) => {
  const { attributes, children, element, collapsedIconClicked } = props;
  const isCollapsed = element.isCollapsed;
  //console.log(props);
  return (
    <div
      {...attributes}
      style={{ display: "flex", columnGap: "10px", marginBottom: "16px" }}
    >
      <div
        onClick={(event) => collapsedIconClicked(event, element)}
        style={{ cursor: "pointer" }}
      >
        {!isCollapsed ? (
          <KeyboardArrowDownRoundedIcon />
        ) : (
          <ChevronRightRoundedIcon />
        )}
      </div>
      <div>{isCollapsed ? [children[0]] : children}</div>
    </div>
  );
};

export default Section;
