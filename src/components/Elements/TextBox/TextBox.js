import React, { useState, useRef, useEffect } from "react";
import { Button } from "@mui/material";
import classes from "./TextBox.module.css";
import { deleteNode } from "../../../Plugins";

const TextBox = (props) => {
  const { attributes, children, editor, element, addNewSection } = props;
  const inputBoxRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    inputBoxRef.current?.focus?.();
  }, []);

  const onButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addNewSection(inputValue, element);
  };

  const onSearchBoxBlur = (event) => {
    console.log("blur");
    deleteNode(editor, element);
  };

  return (
    <div
      {...attributes}
      contentEditable={false} //important; else UI will break if tried to edit
      className={classes.textBoxContainer}
    >
      <input
        type="text"
        placeholder="Enter text here"
        value={inputValue}
        style={{ outline: "none", border: "0px", width: "80%" }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onBlur={onSearchBoxBlur}
        ref={inputBoxRef}
      />
      <Button variant="contained" onMouseDown={onButtonClick}>
        Search
      </Button>
    </div>
  );
};

export default TextBox;
