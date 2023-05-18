import React from "react";
import classes from "./AiBlock.module.css";
import { useSelected, useFocused, useReadOnly } from "slate-react";
import { isEntireNodeSelected } from "../../../Plugins";

const AiBlock = ({ editor, element, attributes, children }) => {
  //const selected = useSelected();
  // const focused = useFocused();
  // const readOnly = useReadOnly();

  // console.log(selected, focused, readOnly);
  const entireNodeSelected = isEntireNodeSelected(editor, element);
  return (
    <div
      {...attributes}
      style={{
        marginBottom: "12px",
        paddingRight: "50px",
        background: entireNodeSelected ? "rgba(35, 131, 226, 0.14)" : "white",
      }}
      className={classes.AiBlockContainer}
    >
      <div>{children}</div>
    </div>
  );
};

export default AiBlock;
