import React, { useState } from "react";
import { findElementPath, updateNodeChildren } from "../../../Plugins";
import classes from "./BlockWrapper.module.css";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Transforms } from "slate";

const BlockWrapper = ({ editor, element, child, attributes }) => {
  const [visibility, setVisibility] = useState("hidden");

  const addNewBlock = () => {
    const newBlock = {
      type: "paragraph",
      children: [
        {
          text: "",
        },
      ],
    };
    const path = findElementPath(editor, element);
    path[path.length - 1] = path[path.length - 1] + 1;
    console.log(path);
    Transforms.insertNodes(editor, newBlock, { at: path });
  };

  const handleClick = () => {
    const path = findElementPath(editor, element);
    updateNodeChildren(editor, path, element.children[0].children);
    Transforms.setNodes(
      editor,
      {
        type: "resourceBlock",
        iconUrl: "LE",
      },
      { at: path }
    );
  };

  const onMouseOver = (e) => {
    e.stopPropagation();
    setVisibility("visible");
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setVisibility("hidden");
  };

  return (
    <div
      className={classes.blockWrapperContainer}
      {...attributes}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div
        onClick={addNewBlock}
        className={classes.buttonContainer}
        style={{ visibility }}
      >
        <AddIcon fontSize="small" />
      </div>
      <div
        className={classes.buttonContainer}
        onClick={handleClick}
        style={{ visibility }}
      >
        <DragIndicatorIcon fontSize="small" />
      </div>

      <div>{child}</div>
    </div>
  );
};

export default BlockWrapper;
