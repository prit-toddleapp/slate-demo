import React from "react";

const AiBlock = (props) => {
  return (
    <div {...props.attributes} style={{ marginBottom: "12px" }}>
      {props.children}
    </div>
  );
};

export default AiBlock;
