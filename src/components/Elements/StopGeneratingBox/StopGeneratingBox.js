import React from "react";
import { Button } from "@mui/material";
import classes from "./StopGeneratingBox.module.css";

const StopGeneratingBox = (props) => {
  const { attributes, children, element, stopGeneratingBlock } = props;

  const stopButtonClicked = (event) => {
    event.preventDefault();
    stopGeneratingBlock(element);
  };

  return (
    <div
      {...attributes}
      contentEditable={false} //important; else UI will break if tried to edit
      className={classes.stopGeneratingBoxContainer}
    >
      <div>Generating your data...</div>
      <Button variant="contained" onClick={stopButtonClicked}>
        Stop
      </Button>
    </div>
  );
};

export default StopGeneratingBox;
