import React, { useState, useCallback } from "react";
import classes from "./UnitFlow.module.css";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import {
  AiBlock,
  BlockSubtext,
  BlockTitle,
  ResourceBlock,
  Section,
  SectionBody,
  SectionHeader,
  DefaultElement,
  TextBox,
} from "./Elements";
import { findElementPath, updateNodeChildren } from "../Plugins";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import { getSectionFromInputText } from "../Utils/Misc";

const initialValue = [
  {
    type: "section",
    isCollapsed: false,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        type: "sectionHeader",
        children: [
          {
            text: "This is the header",
          },
        ],
      },
      {
        type: "sectionBody",
        //isCollapsed: false, is this appraoch better?
        children: [
          {
            type: "textBox",
            children: [{ text: "This is the text box" }],
          },
          {
            type: "aiBlock",
            children: [
              {
                type: "blockTitle",
                children: [{ text: "This is the title paragraph" }],
              },
              {
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
              },
            ],
          },
          {
            type: "resourceBlock",
            iconUrl: "LE",
            children: [{ text: "Resource block" }],
          },
        ],
      },
    ],
  },
  {
    type: "section",
    isCollapsed: true,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        type: "sectionHeader",
        children: [
          {
            text: "This is the header",
          },
        ],
      },
      {
        type: "sectionBody",
        //isCollapsed: false, is this appraoch better?
        children: [
          {
            type: "aiBlock",
            children: [
              {
                type: "blockTitle",
                children: [{ text: "This is the title paragraph" }],
              },
              {
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
              },
            ],
          },
          {
            type: "resourceBlock",
            iconUrl: "LE",
            children: [{ text: "Resource block" }],
          },
        ],
      },
    ],
  },
];

const BlockWrapper = ({ editor, element, child, attributes }) => {
  const addNewBlock = () => {
    const newBlock = {
      type: "textBox",
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

  const handleClick = () => {
    const path = findElementPath(editor, element);
    updateNodeChildren(editor, path, element.children[0].children);
    Transforms.setNodes(
      editor,
      {
        type: "resourceBlock",
        iconUrl: "LE",
      },
      { at: path }
    );
  };

  return (
    <div className={classes.blockWrapperContainer} {...attributes}>
      <div onClick={addNewBlock} className={classes.buttonContainer}>
        <AddIcon fontSize="small" />
      </div>
      <div className={classes.buttonContainer} onClick={handleClick}>
        <DragIndicatorIcon fontSize="small" />
      </div>

      <div>{child}</div>
    </div>
  );
};

function UnitFlow() {
  const [editor] = useState(() => withEditableVoids(withReact(createEditor())));
  const [value, setValue] = useState(initialValue);

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "section":
        return (
          <BlockWrapper
            child={
              <Section {...props} collapsedIconClicked={collapsedIconClicked} />
            }
            editor={editor}
            {...props}
          />
        );
      case "sectionHeader":
        return <SectionHeader {...props} />;
      case "sectionBody":
        return <SectionBody {...props} />;
      case "aiBlock":
        return (
          <BlockWrapper
            child={<AiBlock {...props} editor={editor} />}
            editor={editor}
            {...props}
          />
        );
      case "blockTitle":
        return <BlockTitle {...props} />;
      case "blockSubtext":
        return <BlockSubtext {...props} />;
      case "resourceBlock":
        return (
          <BlockWrapper
            child={<ResourceBlock {...props} />}
            editor={editor}
            {...props}
          />
        );
      case "textBox":
        return <TextBox {...props} addNewSection={addNewSection} />;
      default:
        return (
          <BlockWrapper
            child={<DefaultElement {...props} />}
            editor={editor}
            {...props}
          />
        );
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const keyDownOps = (event) => {};

  const addNewSection = (inputText, element) => {
    let newSection = getSectionFromInputText(inputText);
    let elementPath = findElementPath(editor, element);
    const lastElement = elementPath[elementPath.length - 1];
    let newSectionPath = [...elementPath];
    newSectionPath[newSectionPath.length - 1] =
      lastElement > 1 ? lastElement - 1 : 0;

    console.log(elementPath);
    console.log(newSectionPath);
    if (newSection) {
      // const range = Editor.range(editor, elementPath);
      Transforms.delete(editor, { at: elementPath });
      Transforms.insertNodes(editor, newSection, { at: elementPath });
    }
  };

  const collapsedIconClicked = (event, element) => {
    event.preventDefault();
    const elementPath = findElementPath(editor, element);

    if (elementPath) {
      Transforms.setNodes(
        editor,
        { isCollapsed: !element.isCollapsed },
        { at: elementPath }
      );
    }
  };

  return (
    <div>
      <div style={{ padding: "20px", border: "1px solid black" }}>
        <Slate editor={editor} value={value} onChange={(v) => setValue(v)}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              keyDownOps(event);
            }}
          />
        </Slate>
      </div>

      <div
        style={{ padding: "20px", border: "1px solid red", marginLeft: "50px" }}
      >
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </div>
    </div>
  );
}

const withEditableVoids = (editor) => {
  const { isVoid } = editor;

  const VOID_TYPES = ["textBox"];
  editor.isVoid = (element) => {
    return VOID_TYPES.includes(element.type) ? true : isVoid(element);
  };

  return editor;
};

const Leaf = (props) => {
  let { attributes, children, leaf } = props;
  return <span {...attributes}>{children}</span>;
};

//components

export default UnitFlow;
