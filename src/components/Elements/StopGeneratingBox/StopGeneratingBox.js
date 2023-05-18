import React from "react";
import { Button } from "@mui/material";
import classes from "./StopGeneratingBox.module.css";
import PendingIcon from "@mui/icons-material/Pending";

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
      <div className={classes.pendingIconContainer}>
        <PendingIcon className={classes.pendingIcon} />
        <div>Generating your data...</div>
      </div>

      <Button variant="contained" onClick={stopButtonClicked}>
        Stop
      </Button>
    </div>
  );
};

export default StopGeneratingBox;
