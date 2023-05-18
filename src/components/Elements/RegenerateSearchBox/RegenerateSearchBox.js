import React, { useEffect, useState } from "react";
import { Transforms } from "slate";
import { TextField, Button } from "@mui/material";
import { findElementPath } from "../../../Plugins";

const RegenerateSearchBox = (props) => {
  const { editor, attributes, children, element, regenerateBlock } = props;
  const inputBoxRef = React.useRef();
  const [inputValue, setInputValue] = useState("");

  const regenerateButtonClicked = (event) => {
    event.preventDefault();
    regenerateBlock(inputValue, element);
  };

  useEffect(() => {
    inputBoxRef.current?.focus?.();
  }, []);

  const keyDownOps = (event) => {
    //if (!event.ctrlKey) return;
    switch (event.key) {
      case "Escape":
        //DO NOT DELETE NODES
        // const { selection } = editor;
        // console.log(selection);
        // console.log(findElementPath(editor, element));
        // Transforms.removeNodes(editor, {
        //   at: [
        //     [0, 1, 2],
        //     [0, 1, 3],
        //   ],
        // });
        // Transforms.removeNodes(editor, {
        //   at: findElementPath(editor, element),
        // });

        Transforms.deselect(editor);
        console.log(element);
        Transforms.removeNodes(editor, {
          at: findElementPath(editor, element),
        });

        break;
      case "Enter":
        console.log("Enter pressed");
        break;
      default:
        return;
    }
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
        ref={inputBoxRef}
      />
      <Button variant="contained" onClick={regenerateButtonClicked}>
        Regenerate
      </Button>
    </div>
  );
};

export default RegenerateSearchBox;
