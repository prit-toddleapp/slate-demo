import React, { useState, useCallback, useRef } from "react";
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
  RegenerateSearchBox,
  StopGeneratingBox,
} from "./Elements";
import { findElementPath } from "../Plugins";
import BlockWrapper from "./Elements/BlockWrapper/BlockWrapper";
import { initialValue } from "../Utils/DefaultBlocksUtil";

import {
  getSectionFromInputText,
  incrementPath,
  decrementPath,
} from "../Utils/Misc";

function UnitFlow() {
  const [editor] = useState(() => withReact(createEditor()));
  const [value, setValue] = useState(initialValue);
  const abortController = useRef(null);

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
      case "searchBox":
        return <TextBox {...props} addNewSection={addNewSection} />;

      case "regenerateSearchBox":
        return (
          <RegenerateSearchBox {...props} regenerateBlock={regenerateBlock} />
        );
      case "stopGeneratingBox":
        return (
          <StopGeneratingBox
            {...props}
            stopGeneratingBlock={stopGeneratingBlock}
          />
        );
      default:
        return (
          <BlockWrapper
            child={<DefaultElement {...props} editor={editor} />}
            editor={editor}
            {...props}
          />
        );
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const keyDownOps = (event) => {
    if (!event.ctrlKey) return;
    switch (event.key) {
      case "Escape":
        const { selection } = editor;
        console.log(selection);
        Transforms.removeNodes(editor);
        break;
      case "Enter":
        console.log("Enter pressed");
        break;
      default:
        return;
    }
  };

  const addNewSection = (inputText, element) => {
    abortController.current = new AbortController();

    let elementPath = findElementPath(editor, element);
    Transforms.delete(editor, { at: elementPath });
    Transforms.insertNodes(
      editor,
      { type: "stopGeneratingBox", children: [{ text: "" }] },
      { at: elementPath }
    );

    fetch("https://hub.dummyapis.com/delay?seconds=2", {
      signal: abortController.current.signal,
    })
      .then((data) => {
        let newSection = getSectionFromInputText(inputText);

        if (!newSection) throw new Error("Invalid input");

        Transforms.delete(editor, { at: elementPath });
        Transforms.insertNodes(editor, newSection, {
          at: elementPath,
        });
        const range = Editor.range(editor, elementPath);
        Transforms.select(editor, range);
        Transforms.insertNodes(
          editor,
          { type: "regenerateSearchBox", children: [{ text: "" }] },
          { at: incrementPath(elementPath) }
        );
      })
      .catch((error) => {
        console.log(error);
        //what is the error behaviour??
        Transforms.delete(editor, { at: elementPath });
      })
      .finally(() => {
        console.log("finally");
      });
  };

  const regenerateBlock = (inputText, element) => {
    let elementPath = findElementPath(editor, element);
    Transforms.delete(editor, { at: decrementPath(elementPath) });
    addNewSection(inputText, element);
  };

  const stopGeneratingBlock = () =>
    abortController.current && abortController.current.abort();

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

  const select = () => {
    const range = Editor.range(editor, [0, 0, 0]);
    Transforms.select(editor, range);
  };

  const show = () => {
    console.log(editor.selection);
  };

  return (
    <div className={classes.untFlowBlock}>
      <h1>Unit Flow</h1>
      <div className={classes.slateContainer}>
        <Slate editor={editor} value={value} onChange={(v) => setValue(v)}>
          {/* <button onClick={select}>select</button>
          <button onClick={show}>give selection</button> */}
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              keyDownOps(event);
            }}
          />
        </Slate>
      </div>
    </div>
  );
}

// const withEditableVoids = (editor) => {
//   const { isVoid } = editor;

//   const VOID_TYPES = ["searchBox"];
//   editor.isVoid = (element) => {
//     return VOID_TYPES.includes(element.type) ? true : isVoid(element);
//   };

//   return editor;
// };

const Leaf = (props) => {
  let { attributes, children, leaf } = props;
  return <span {...attributes}>{children}</span>;
};

//components

export default UnitFlow;
