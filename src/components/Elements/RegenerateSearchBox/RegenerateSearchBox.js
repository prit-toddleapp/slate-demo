import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const RegenerateSearchBox = (props) => {
  const {
    attributes,
    children,
    element,
    collapsedIconClicked,
    regenerateBlock,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const regenerateButtonClicked = (event) => {
    event.preventDefault();
    regenerateBlock(inputValue, element);
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
    >
      <input
        type="text"
        placeholder="Add more details here and regenerate this response or press ‘Esc’"
        value={inputValue}
        style={{ outline: "none", border: "0px", width: "80%" }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Button variant="contained" onClick={regenerateButtonClicked}>
        Regenerate
      </Button>
    </div>
  );
};

export default RegenerateSearchBox;
