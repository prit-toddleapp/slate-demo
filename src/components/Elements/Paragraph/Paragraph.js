import React from "react";

const Paragraph = (props) => {
  return (
    <div {...props.attributes} style={{ fontWeight: "500", fontSize: "16px" }}>
      {props.children}
    </div>
  );
};

export default Paragraph;
