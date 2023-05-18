import React from "react";
import classes from "./AiBlock.module.css";
import { useSelected, useFocused, useReadOnly } from "slate-react";

const AiBlock = ({ editor, element, attributes, children }) => {
  const selected = useSelected();
  // const focused = useFocused();
  // const readOnly = useReadOnly();

  // console.log(selected, focused, readOnly);
  return (
    <div
      {...attributes}
      style={{
        marginBottom: "12px",
        backgroundColor: selected ? "#eee" : "white",
      }}
      className={classes.AiBlockContainer}
    >
      <div>{children}</div>
    </div>
  );
};

export default AiBlock;
