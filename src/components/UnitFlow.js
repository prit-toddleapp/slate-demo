import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

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
        return <Section {...props} />;
      case "sectionHeader":
        return <SectionHeader {...props} />;
      case "sectionBody":
        return <SectionBody {...props} />;
      case "aiBlock":
        return <AiBlock {...props} />;
      case "blockTitle":
        return <BlockTitle {...props} />;
      case "blockSubtext":
        return <BlockSubtext {...props} />;
      case "resourceBlock":
        return <ResourceBlock {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const keyDownOps = (event) => {};

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

const Section = (props) => {
  const { attributes, children, element } = props;
  console.log(children);
  return (
    <div
      {...attributes}
      style={{ display: "flex", columnGap: "10px", marginBottom: "16px" }}
    >
      <div>
        {element.isCollapsed ? element.collapsedIcon : element.expandedIcon}
      </div>
      <div>{element.isCollapsed ? [children[0]] : children}</div>
    </div>
  );
};

const SectionHeader = (props) => {
  return (
    <div
      {...props.attributes}
      style={{ fontWeight: "500", marginBottom: "12px" }}
    >
      <div>{props.children}</div>
    </div>
  );
};

const SectionBody = (props) => {
  if (props.element.isCollapsed) return null;

  return (
    <div {...props.attributes}>
      <div>{props.children}</div>
    </div>
  );
};

const AiBlock = (props) => {
  return (
    <div {...props.attributes} style={{ marginBottom: "12px" }}>
      {props.children}
    </div>
  );
};

const BlockTitle = (props) => {
  return (
    <div {...props.attributes} style={{ fontWeight: "500", fontSize: "16px" }}>
      {props.children}
    </div>
  );
};

const BlockSubtext = (props) => {
  return (
    <div
      {...props.attributes}
      style={{ fontWeight: "normal", fontSize: "14px", color: "#717171" }}
    >
      {props.children}
    </div>
  );
};

const ResourceBlock = (props) => {
  const { element } = props;
  return (
    <div
      {...props.attributes}
      style={{
        display: "flex",
        marginBottom: "12px",
        columnGap: "10px",
        fontWeight: "500",
        fontSize: "16px",
      }}
    >
      <div style={{ color: "blue" }}>{element.iconUrl}</div>
      <div>{props.children}</div>
    </div>
  );
};

const DefaultElement = (props) => {
  return <div {...props.attributes}>{props.children}</div>;
};

export default UnitFlow;
