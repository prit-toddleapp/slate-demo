import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
import {
  addNewBlock,
  atleastOneNodeSelected,
  deleteSelectedNodes,
  findElementPath,
  fullySelectedRange,
  setSelectedNodes,
  removeSelectedProperty,
} from "../Plugins";
import BlockWrapper from "./Elements/BlockWrapper/BlockWrapper";
import { initialValue } from "../Utils/DefaultBlocksUtil";
import {
  getSectionFromInputText,
  incrementPath,
  selectableNodeTypes,
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
import { makeNodeId } from "../Plugins/WithNodeId";

const getElementById = (id, element) => {
  if (element.id === id) return element;
  if (element.children) {
    for (let child of element.children) {
      const result = getElementById(id, child);
      if (result) return result;
    }
  }
  return null;
};

const useEditor = () =>
  useMemo(() => withNodeId(withReact(createEditor())), []);

function UnitFlow() {
  const editor = useEditor();
  const [value, setValue] = useState(initialValue);
  const abortController = useRef(null);

  //drag and drop
  const [activeId, setActiveId] = useState(null);
  const activeElement = getElementById(activeId, editor);

  //console.log({ editor, activeElement });
  const handleDragStart = (event) => {
    if (event.active) {
      clearSelection();
      setActiveId(event.active.id);
    }
    //console.log({ event });
  };

  const handleDragEnd = (event) => {
    console.log(event);
    const overId = event.over?.id;
    const overElement = getElementById(overId, editor);
    const elementPath = findElementPath(editor, activeElement);
    const overElementPath = findElementPath(editor, overElement);
    console.log({ overElementPath, elementPath, overElement });
    if (!_.isEqual(overElementPath, elementPath)) {
      Transforms.moveNodes(editor, {
        at: elementPath,
        to: overElementPath,
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
    const isDraggableBlock =
      false &&
      _.includes(
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
        return (
          <TextBox {...props} editor={editor} addNewSection={addNewSection} />
        );

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

  const clickOps = (event) => {
    if (event.button === 0) {
      if (event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        setSelectedNodes(editor);
      } else {
        removeSelectedProperty(editor);
      }
    }
  };

  const addNewSection = (inputText, element) => {
    abortController.current = new AbortController();

    let elementPath = findElementPath(editor, element);
    Transforms.delete(editor, { at: elementPath });
    Transforms.insertNodes(
      editor,
      { id: makeNodeId(), type: "stopGeneratingBox", children: [{ text: "" }] },
      { at: elementPath }
    );

    fetch("https://hub.dummyapis.com/delay?seconds=2", {
      signal: abortController.current.signal,
    })
      .then((data) => {
        let newSection = getSectionFromInputText(inputText);

        if (!newSection) throw new Error("Invalid input");
        Transforms.delete(editor, { at: elementPath });
        Transforms.insertNodes(editor, _.cloneDeep(newSection), {
          at: elementPath,
        });

        const range = Editor.range(
          editor,
          elementPath,
          incrementPath(elementPath, newSection.length - 1)
        );

        Transforms.select(editor, range);
        //setSelectedNodes(editor);
        //TODO: below code is a replacement for the above commented code, make above func generic
        const selectedNodes = Editor.nodes(editor, {});
        for (const selectedNode of selectedNodes) {
          const [node, path] = selectedNode;
          if (_.includes(selectableNodeTypes, node.type)) {
            Transforms.setNodes(editor, { selected: true }, { at: path });
          }
        }

        Transforms.insertNodes(
          editor,
          {
            id: makeNodeId(),
            type: "regenerateSearchBox",
            children: [{ text: "" }],
          },
          { at: incrementPath(elementPath, newSection.length) }
        );
      })
      .catch((error) => {
        console.log(error);
        //what is the error behaviour??
        Transforms.delete(editor, { at: elementPath });
      });
  };

  const regenerateBlock = (inputText, element) => {
    deleteSelectedNodes(editor, element);

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
    // const range = {
    //   anchor: { path: [0, 1, 0, 0, 0], offset: 18 },
    //   focus: { path: [0, 1, 0, 0, 0], offset: 27 },
    // };

    // const range = Editor.range(editor, [0, 1, 0], [1]);

    // Transforms.select(editor, range);
    // setSelectedNodes(editor);
    console.log(editor.selection);
  };

  const show = () => {
    const { selection } = editor;
    const startOfEditor = Editor.range(editor, []);
    console.log("first", Editor.first(editor, selection));
    console.log("last", Editor.last(editor, selection));

    console.log("edges", Editor.edges(editor, selection));
    console.log("fragment", Editor.fragment(editor, selection));
  };

  useEffect(() => {
    //remove selection on UI

    if (atleastOneNodeSelected(editor)) {
      if (window.getSelection) {
        if (window.getSelection().removeAllRanges) {
          // Firefox Chrome
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        // IE?
        document.selection.empty();
      }
    }

    /*** atleastOneNodeSelected used to solve these ISSUES: ***/
    //1. Blocks cannot be edited after one character
    //2. Search input box focus not working
  }, [value]);

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
                onClick={(event) => {
                  clickOps(event);
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
          <div
            className={classes.extraContainer}
            onClick={() => addNewBlock(editor)}
          ></div>
        </Slate>
      </div>
      {/* <div>{JSONViewer(value)}</div> */}
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
