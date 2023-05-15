import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue = [
  {
    type: "section",
    isCollapsed: false,
    children: [
      {
        type: "header",
        children: [
          {
            text: "This is the header",
            collapsedIcon: "url",
            expandedIcon: "url",
          },
        ],
      },
      {
        type: "sectionBody",
        children: [
          {
            type: "aiBlock",
            children: [
              {
                type: "BlockTitle",
                children: [{ text: "This is the title paragraph" }],
              },
              {
                type: "BlockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
              },
            ],
          },
          {
            type: "resourceBlock",
            children: [{ text: "This is the title paragraph", icon: "url" }],
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
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const keyDownOps = (event) => {};

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
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
  return (
    <span {...attributes} style={{ fontWeight: leaf.bold ? "bold" : "normal" }}>
      {children}
    </span>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export default UnitFlow;
