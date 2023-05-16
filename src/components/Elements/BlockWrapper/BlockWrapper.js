import React, { useState } from "react";
import { findElementPath, turnInElement } from "../../../Plugins";
import _ from "lodash";
import classes from "./BlockWrapper.module.css";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Transforms } from "slate";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { getMenuOptions, menuOptions } from "../../../Utils/DefaultBlocksUtil";

const BlockWrapper = ({ editor, element, child, attributes }) => {
  const [visibility, setVisibility] = useState("hidden");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const addNewBlock = () => {
    const newBlock = {
      type: "newBlock",
      children: [
        {
          text: "",
        },
      ],
    };
    const path = findElementPath(editor, element);
    path[path.length - 1] = path[path.length - 1] + 1;
    Transforms.insertNodes(editor, newBlock, { at: path });
  };

  const onMouseOver = (e) => {
    e.stopPropagation();
    setVisibility("visible");
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setVisibility("hidden");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(() => {
      return true;
    });
  };

  const handleClose = (e) => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleMenuClick = (e) => {
    console.log(e.target.textContent);
    switch (e.target.textContent) {
      case "Ask Shifu":
        addNewBlock();
        break;
      case "Duplicate":
        {
          const path = findElementPath(editor, element);
          path[path.length - 1] = path[path.length - 1] + 1;
          Transforms.insertNodes(editor, _.cloneDeep(element), { at: path });
        }
        break;
      case "Delete":
        {
          const path = findElementPath(editor, element);
          Transforms.removeNodes(editor, { at: path });
        }
        break;
      case "Turn In to LE":
        turnInElement(editor, element, "LE");
        break;
      case "Turn In to FA":
        turnInElement(editor, element, "FA");
        break;
      case "Turn In to SA":
        turnInElement(editor, element, "SA");
        break;
      default: {
      }
    }
    handleClose();
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
      <div className={classes.buttonContainer} style={{ visibility }}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={isOpen ? "long-menu" : undefined}
          aria-expanded={isOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>

        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch",
            },
          }}
        >
          {getMenuOptions(element.type).map((option) => (
            <MenuItem
              key={option.key}
              selected={option === "Pyxis"}
              onClick={handleMenuClick}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div>{child}</div>
    </div>
  );
};

export default BlockWrapper;
