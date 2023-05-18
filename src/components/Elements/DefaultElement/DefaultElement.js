import React, { useState } from "react";
import classes from "./DefaultElement.module.css";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { newBlockMenuOptions } from "../../../Utils/DefaultBlocksUtil";
import {
  addNewBlock,
  addShifuSearchBox,
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
    const path = findElementPath(editor, element);
    console.log(path, element);
    switch (e.target.textContent) {
      case "Ask Shifu":
        //Op1
        addShifuSearchBox(editor, element);
        //Op2
        // updateNodeChildren(editor, path, [{ text: "" }], false);
        // Transforms.setNodes(
        //   editor,
        //   {
        //     type: "searchBox",
        //     children: [{ text: "" }],
        //   },
        //   { at: path }
        // );
        break;
      case "Add new section":
        updateNodeChildren(
          editor,
          path,
          [
            {
              type: "sectionHeader",
              children: [
                {
                  text: "",
                },
              ],
            },
            {
              type: "newBlock",
              children: [
                {
                  text: "",
                },
              ],
            },
          ],
          false
        );
        Transforms.setNodes(
          editor,
          {
            type: "section",
            isCollapsed: false,
          },
          { at: path }
        );

        console.log("path", path);
        Transforms.select(editor, path);
        break;
      default:
        addNewBlock(editor, element);
        break;
    }
    handleClose();
  };

  const updateBlock = () => {
    const path = findElementPath(editor, element);

    Transforms.setNodes(
      editor,
      {
        type: "paragraph",
      },
      { at: path }
    );

    Transforms.select(editor, path);
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
      <div className={classes.placeholder} onClick={updateBlock}>
        {"Click on the [+] button or directly start typing here"}
      </div>
    </div>
  );
};

export default DefaultElement;
