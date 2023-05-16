import React, { useState } from "react";
import classes from "./DefaultElement.module.css";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { newBlockMenuOptions } from "../../../Utils/DefaultBlocksUtil";
import {
  addNewBlock,
  findElementPath,
  updateNodeChildren,
} from "../../../Plugins";
import { Transforms } from "slate";

const DefaultElement = ({ editor, element, attributes, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(() => {
      return true;
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleMenuClick = (e) => {
    switch (e.target.textContent) {
      case "Ask Shifu":
        addNewBlock(editor, element);
        break;
      case "Add new section":
        const path = findElementPath(editor, element);
        updateNodeChildren(editor, path, [
          {
            type: "sectionHeader",
            children: [
              {
                text: "",
              },
            ],
          },
        ]);
        Transforms.setNodes(
          editor,
          {
            type: "section",
            isCollapsed: false,
          },
          { at: path }
        );
        break;
      default:
        addNewBlock(editor, element);
        break;
    }
    handleClose();
  };

  return (
    <div {...attributes} className={classes.defaultBlockContainer}>
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={isOpen ? "long-menu" : undefined}
          aria-expanded={isOpen ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <AddCircleRoundedIcon fontSize="small" />
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
          {newBlockMenuOptions.map((option) => (
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
      {children}
    </div>
  );
};

export default DefaultElement;
