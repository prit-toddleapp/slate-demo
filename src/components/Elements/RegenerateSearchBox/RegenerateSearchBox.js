import React, { useEffect, useState } from "react";
import { Transforms } from "slate";
import { TextField, Button } from "@mui/material";
import { findElementPath, deleteNode } from "../../../Plugins";

const RegenerateSearchBox = (props) => {
  const { editor, attributes, children, element, regenerateBlock } = props;
  const inputBoxRef = React.useRef(null);
  const [inputValue, setInputValue] = useState("");

  const regenerateButtonClicked = (event) => {
    console.log("clicked");
    event.preventDefault();
    event.stopPropagation();
    regenerateBlock(inputValue, element);
  };

  useEffect(() => {
    inputBoxRef.current?.focus?.();
  }, []);

  const keyDownOps = (event) => {
    switch (event.key) {
      case "Escape":
        Transforms.deselect(editor);
        console.log(element);
        Transforms.removeNodes(editor, {
          at: findElementPath(editor, element),
        });

        break;
      default:
        return;
    }
  };

  const onSearchBoxBlur = (event) => {
    console.log("blur");
    deleteNode(editor, element);
  };

  return (
    <div
      {...attributes}
      contentEditable={false} //important; else UI will break if tried to edit
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
        boxShadow: "0px 5px 10px rgba(0, 46, 57, 0.15)",
        padding: "10px",
        borderRadius: "5px",
        minWidth: "700px",
      }}
      onKeyDown={(event) => {
        keyDownOps(event);
      }}
    >
      <input
        type="text"
        placeholder="Add more details here and regenerate this response or press ‘Esc’"
        value={inputValue}
        style={{ outline: "none", border: "0px", width: "80%" }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={onSearchBoxBlur}
        ref={inputBoxRef}
      />
      <Button variant="contained" onMouseDown={regenerateButtonClicked}>
        Regenerate
      </Button>
    </div>
  );
};

export default RegenerateSearchBox;
