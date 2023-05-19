import React, { useState, useCallback, useRef, useMemo } from "react";
import classes from "./UnitFlow.module.css";
import { createEditor, Transforms, Editor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
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
import { JSONViewer } from "./../Utils/JsonViewer";
import { findElementPath } from "../Plugins";
import BlockWrapper from "./Elements/BlockWrapper/BlockWrapper";
import { initialValue } from "../Utils/DefaultBlocksUtil";
import {
  getSectionFromInputText,
  incrementPath,
  decrementPath,
} from "../Utils/Misc";
import Paragraph from "./Elements/Paragraph/Paragraph";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { withNodeId } from "../Plugins/WithNodeId";
import { createPortal } from "react-dom";
import _ from "lodash";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const useEditor = () =>
  useMemo(() => withNodeId(withReact(createEditor())), []);

function UnitFlow() {
  const editor = useEditor();
  const [value, setValue] = useState(initialValue);
  const abortController = useRef(null);

  //drag and drop
  const [activeId, setActiveId] = useState(null);
  const activeElement = editor.children.find((x) => x.id === activeId);
  console.log({ editor });
  const handleDragStart = (event) => {
    if (event.active) {
      clearSelection();
      setActiveId(event.active.id);
    }
    console.log({ event });
  };

  const handleDragEnd = (event) => {
    // const overId = event.over?.id;
    // const overIndex = value.findIndex((x) => x.id === overId);
    // console.log({ event, overId, overIndex, child: editor });
    // console.log({ activeElement, editor });
    // let elementPath = findElementPath(editor, activeElement);
    // if (overId !== activeId && overIndex !== -1 && overId !== undefined) {
    //   Transforms.moveNodes(editor, {
    //     at: [],
    //     match: (node) => node.id === activeId,
    //     to: [overIndex],
    //   });
    // }

    // setActiveId(null);
    const overId = event.over?.id;
    const overIndex = editor.children.findIndex((x) => x.id === overId);

    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node) => node.id === activeId,
        to: [overIndex],
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const clearSelection = () => {
    ReactEditor.blur(editor);
    Transforms.deselect(editor);
    window.getSelection()?.empty();
  };

  const renderElement = useCallback((props) => {
    const isDraggableBlock = _.includes(
      ["section", "resourceBlock", "paragraph", "newBlock", "aiBlock"],
      props.element.type
    );

    return isDraggableBlock ? (
      <SortableElement {...props} renderElement={renderElementContent} />
    ) : (
      renderElementContent(props)
    );
  }, []);

  const renderElementContent = useCallback((props) => {
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
          <RegenerateSearchBox
            {...props}
            regenerateBlock={regenerateBlock}
            editor={editor}
          />
        );
      case "stopGeneratingBox":
        return (
          <StopGeneratingBox
            {...props}
            stopGeneratingBlock={stopGeneratingBlock}
          />
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
    //TESTING
    // if (!event.ctrlKey) return;
    // switch (event.key) {
    //   case "a":
    //     const { selection } = editor;
    //     console.log(selection);
    //     //Transforms.removeNodes(editor);
    //     break;
    //   case "Enter":
    //     console.log("Enter pressed");
    //     break;
    //   default:
    //     return;
    // }
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

        const range = Editor.range(
          editor,
          elementPath,
          incrementPath(elementPath, newSection.length - 1)
        );
        Transforms.select(editor, range);
        Transforms.insertNodes(
          editor,
          { type: "regenerateSearchBox", children: [{ text: "" }] },
          { at: incrementPath(elementPath, newSection.length) }
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
    //const range = Editor.range(editor, [0, 0, 0]);
    const range = {
      anchor: { path: [0, 1, 0, 0, 0], offset: 18 },
      focus: { path: [0, 1, 0, 0, 0], offset: 27 },
    };

    Transforms.select(editor, range);
  };

  const show = () => {
    console.log(editor.selection);
    console.log(Editor.unhangRange(editor, editor.selection));
  };
  console.log(value);

  const items = useMemo(
    () => editor.children.map((element) => element.id),
    [editor.children]
  );

  return (
    <div className={classes.untFlowBlock}>
      <h1>Unit Flow</h1>
      <div className={classes.slateContainer}>
        <Slate editor={editor} value={value} onChange={(v) => setValue(v)}>
          {/* <button onClick={select}>select</button>
          <button onClick={show}>give selection</button> */}
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onKeyDown={(event) => {
                  keyDownOps(event);
                }}
              />
            </SortableContext>
            {createPortal(
              <DragOverlay adjustScale={false}>
                {activeElement && (
                  <DragOverlayContent element={activeElement} editor={editor} />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </Slate>
      </div>
      {JSONViewer(value)}
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

const DragOverlayContent = ({ element }) => {
  const editor = useEditor();
  const [value] = useState([JSON.parse(JSON.stringify(element))]); // clone
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "section":
        return (
          <BlockWrapper
            child={<Section {...props} />}
            editor={editor}
            isDragged={true}
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
            isDragged={true}
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
            isDragged={true}
            child={<ResourceBlock {...props} />}
            editor={editor}
            {...props}
          />
        );
      case "searchBox":
        return <TextBox {...props} />;

      case "regenerateSearchBox":
        return <RegenerateSearchBox {...props} editor={editor} />;
      case "stopGeneratingBox":
        return <StopGeneratingBox {...props} />;
      case "paragraph":
        return (
          <BlockWrapper
            isDragged={true}
            child={<Paragraph {...props} editor={editor} />}
            editor={editor}
            {...props}
          />
        );
      default:
        return (
          <BlockWrapper
            isDragged={true}
            child={<DefaultElement {...props} editor={editor} />}
            editor={editor}
            {...props}
          />
        );
    }
  }, []);
  return (
    <div className={classes.container}>
      <div className={classes.dragIcon}>
        <DragIndicatorIcon fontSize="small" />
      </div>
      <Slate editor={editor} value={value}>
        <Editable readOnly={true} renderElement={renderElement} />
      </Slate>
    </div>
  );
};

const SortableElement = (props) => {
  const { attributes, element, children, renderElement } = props;
  const sortable = useSortable({ id: element.id });

  return (
    <div {...attributes}>
      <Sortable sortable={sortable}>
        <div className={classes.container}>
          <div
            contentEditable={false}
            {...sortable.listeners}
            className={classes.dragIcon}
          >
            <DragIndicatorIcon fontSize="small" />
          </div>
          <div>{renderElement(props)}</div>
        </div>
      </Sortable>
    </div>
  );
};

const Sortable = ({ sortable, children }) => {
  return (
    <div
      className="sortable"
      {...sortable.attributes}
      ref={sortable.setNodeRef}
      style={{
        transition: sortable.transition,
        "--translate-y": toPx(sortable.transform?.y),
        pointerEvents: sortable.isSorting ? "none" : undefined,
        opacity: sortable.isDragging ? 0 : 1,
      }}
    >
      {children}
    </div>
  );
};

const toPx = (value) => (value ? `${Math.round(value)}px` : undefined);
