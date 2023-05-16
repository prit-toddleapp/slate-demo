import React, { useState, useCallback } from "react";
import { createEditor, Transforms } from "slate";
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
} from "./Elements";
import { findElementPath } from "../Plugins";
import BlockWrapper from "./Elements/BlockWrapper/BlockWrapper";

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

function UnitFlow() {
  const [editor] = useState(() => withReact(createEditor()));
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

const Leaf = (props) => {
  let { attributes, children, leaf } = props;
  return <span {...attributes}>{children}</span>;
};

//components

export default UnitFlow;
