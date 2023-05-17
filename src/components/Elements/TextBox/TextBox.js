import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import ForwardIcon from "@mui/icons-material/Forward";

const TextBox = (props) => {
  const { attributes, children, element, collapsedIconClicked, addNewSection } =
    props;

  const [inputValue, setInputValue] = useState("");

  const onButtonClick = (event) => {
    event.preventDefault();
    addNewSection(inputValue, element);
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
        placeholder="Enter text here"
        value={inputValue}
        style={{ outline: "none", border: "0px" }}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <Button variant="contained" onClick={onButtonClick}>
        Search
      </Button>
    </div>
  );
};

export default TextBox;
