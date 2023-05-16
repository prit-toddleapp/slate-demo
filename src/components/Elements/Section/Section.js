import React from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const Section = (props) => {
  const { children, element } = props;
  console.log(children);
  return (
    <div style={{ display: "flex", columnGap: "10px", marginBottom: "16px" }}>
      <div>
        {element.isCollapsed ? (
          <KeyboardArrowDownRoundedIcon />
        ) : (
          <ChevronRightRoundedIcon />
        )}
      </div>
      <div>{element.isCollapsed ? [children[0]] : children}</div>
    </div>
  );
};

export default Section;
