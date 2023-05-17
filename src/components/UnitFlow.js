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
  RegenerateSearchBox,
} from "./Elements";
import { findElementPath } from "../Plugins";
import BlockWrapper from "./Elements/BlockWrapper/BlockWrapper";
import { initialValue } from "../Utils/DefaultBlocksUtil";

import {
  getSectionFromInputText,
  incrementPath,
  decrementPath,
} from "../Utils/Misc";
import Paragraph from "./Elements/Paragraph/Paragraph";

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
      case "searchBox":
        return <TextBox {...props} addNewSection={addNewSection} />;
      case "loadingSearchBox":
        return <div>Generating block...</div>;
      case "regenerateSearchBox":
        return (
          <RegenerateSearchBox {...props} regenerateBlock={regenerateBlock} />
        );
      case "paragraph":
        return (
          <BlockWrapper
            child={<Paragraph {...props} editor={editor} />}
            editor={editor}
            {...props}
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

  const fakeApiCall = (data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let newSection = getSectionFromInputText(data);
        if (!newSection) reject("Invalid input");

        resolve(newSection);
      }, 1500); // resolves after 2 seconds
    });
  };

  const addNewSection = (inputText, element) => {
    let elementPath = findElementPath(editor, element);
    //Transforms.delete(editor, { at: elementPath });
    Transforms.insertNodes(
      editor,
      { type: "loadingSearchBox", children: [{ text: "Generating block..." }] },
      { at: elementPath }
    );

    fakeApiCall(inputText)
      .then((newSection) => {
        console.log(newSection);
        Transforms.delete(editor, { at: elementPath });
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
        Transforms.delete(editor, { at: elementPath });
      });

    // let elementPath = findElementPath(editor, element);
    // const lastElement = elementPath[elementPath.length - 1];
    // let newSectionPath = [...elementPath];
    // newSectionPath[newSectionPath.length - 1] =
    //   lastElement > 1 ? lastElement - 1 : 0;

    // console.log(elementPath);
    // console.log(newSectionPath);
    // if (newSection) {
    //   // const range = Editor.range(editor, elementPath);
    //   Transforms.delete(editor, { at: elementPath });
    //   Transforms.insertNodes(editor, newSection, { at: elementPath });
    // }
  };

  const regenerateBlock = (inputText, element) => {
    let elementPath = findElementPath(editor, element);
    Transforms.delete(editor, { at: decrementPath(elementPath) });
    console.log(inputText);
    console.log(element);
    addNewSection(inputText, element);
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

const withEditableVoids = (editor) => {
  const { isVoid } = editor;

  const VOID_TYPES = ["searchBox"];
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
