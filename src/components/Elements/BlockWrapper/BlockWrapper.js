import React, { useState } from "react";
import {
  addNewBlock,
  findElementPath,
  turnInElement,
  updateNodeChildren,
  removeSelectedProperty,
  isEntireNodeSelected,
} from "../../../Plugins";
import _ from "lodash";
import classes from "./BlockWrapper.module.css";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Transforms, Editor } from "slate";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { getMenuOptions } from "../../../Utils/DefaultBlocksUtil";
import { makeNodeId } from "../../../Plugins/WithNodeId";

const BlockWrapper = ({ editor, element, child, attributes }) => {
  const [visibility, setVisibility] = useState("hidden");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const unwrapSectionBlocks = (editor, path) => {
    const [, sectionPath] = Editor.node(editor, path);
    const [, sectionBodyPath] = Editor.node(editor, [...sectionPath, 1]);
    console.log({ sectionBodyPath });
    Transforms.liftNodes(editor, { at: sectionBodyPath, voids: true });
    Transforms.removeNodes(editor, { at: sectionPath });
  };

  const unwrapSectionBlocksRecursive = (editor, path) => {
    const [node] = Editor.node(editor, path);

    if (node.type === "section") {
      unwrapSectionBlocks(editor, path);
      return;
    }

    for (let i = 0; i < node.children.length; i++) {
      const childPath = [...path, i];
      unwrapSectionBlocksRecursive(editor, childPath);
    }
  };

  const handleUnwrapSectionBlocks = (path) => {
    unwrapSectionBlocksRecursive(editor, path);
  };

  const onMouseOver = (e) => {
    e.stopPropagation();
    setVisibility("visible");
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setVisibility("hidden");
  };

  const selectEntireNode = () => {
    removeSelectedProperty(editor);
    const path = findElementPath(editor, element);
    const range = Editor.range(editor, path);

    Transforms.setNodes(editor, { selected: true }, { at: path });
    //"newBlock" node is causing error due to text:""; check this
    Transforms.select(editor, range);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (!isEntireNodeSelected(editor, element)) selectEntireNode();

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
    switch (e.target.textContent) {
      case "Ask Shifu":
        addNewBlock(editor, element, {
          id: makeNodeId(),
          type: "regenerateSearchBox",
          children: [{ text: "" }],
        });
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
      case "Delete Only Section":
        {
          const path = findElementPath(editor, element);
          handleUnwrapSectionBlocks(path);
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
      case "Turn In to Section":
        const path = findElementPath(editor, element);
        let children = [
          {
            type: "sectionHeader",
            children: element.children,
          },
          {
            type: "newBlock",
            children: [
              {
                text: "",
              },
            ],
          },
        ];
        updateNodeChildren(editor, path, children);
        Transforms.setNodes(
          editor,
          {
            type: "section",
            isCollapsed: false,
          },
          { at: path }
        );
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
        onClick={() => addNewBlock(editor, element)}
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
