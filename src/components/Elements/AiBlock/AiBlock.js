import React from "react";
import classes from "./AiBlock.module.css";
import { Transforms } from "slate";
import { findElementPath, updateNodeChildren } from "../../../Plugins";

const AiBlock = ({ editor, element, attributes, children }) => {
  const handleClick = () => {
    const path = findElementPath(editor, [], element);
    console.log(element.children[0].children);
    console.log({
      updatedNode: {
        type: "resourceBlock",
        iconUrl: "LE",
        children: element.children[0].children,
      },
    });
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

  return (
    <div
      {...attributes}
      style={{ marginBottom: "12px" }}
      className={classes.AiBlockContainer}
    >
      <div className={classes.buttonContainer}>
        <button onClick={handleClick}>...</button>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AiBlock;
