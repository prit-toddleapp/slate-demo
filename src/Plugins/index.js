import { Editor, Transforms, Range } from "slate";
import {
  incrementPath,
  selectableNodeTypes,
  decrementPath,
} from "../Utils/Misc";
import _ from "lodash";
import { makeNodeId } from "./WithNodeId";

export const findElementPath = (editor, element) => {
  const [match] = Editor.nodes(editor, {
    at: [],
    match: (n) => n === element,
  });
  return match ? match[1] : null;
};

export const updateNodeChildren = (
  editor,
  path,
  newChildren,
  removeChild = true
) => {
  if (removeChild) {
    const range = Editor.range(editor, path);
    console.log({ range });
    Transforms.delete(editor, { at: range });
  }

  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    Transforms.insertNodes(editor, child, { at: [...path, i] });
  }
};

export const turnInElement = (editor, element, iconType) => {
  const path = findElementPath(editor, element);
  let children = [];
  if (element.type === "aiBlock") children = element.children[0].children;
  else children = element.children;
  updateNodeChildren(editor, path, children);
  Transforms.setNodes(
    editor,
    {
      type: "resourceBlock",
      iconUrl: iconType,
    },
    { at: path }
  );
};

export const addNewBlock = (
  editor,
  element,
  block = {
    id: makeNodeId(),
    type: "newBlock",
    children: [
      {
        text: "",
      },
    ],
  }
) => {
  const path = findElementPath(editor, element);
  Transforms.insertNodes(editor, block, { at: incrementPath(path) });
};

export const addShifuSearchBox = (editor, element) => {
  const newBlock = {
    id: makeNodeId(),
    type: "searchBox",
    children: [
      {
        text: "",
      },
    ],
  };
  const path = findElementPath(editor, element);
  Transforms.delete(editor, { at: path });
  Transforms.insertNodes(editor, newBlock, { at: path });
};

//there is some editor.selection
//check if the element's range in entirely included in the selection
export const isEntireNodeSelected = (editor, element) => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }

  const path = findElementPath(editor, element);
  const nodeRange = Editor.range(editor, path);

  let { anchor: anchorSelection, focus: focusSelection } = selection;
  let { anchor: anchorNodeRange, focus: focusNodeRange } = nodeRange;

  if (Range.isBackward(selection)) {
    [anchorSelection, focusSelection] = [focusSelection, anchorSelection];
  }

  //for equal objs, Range.isBackward gives false but Range.isForward gives true
  const isNodeAnchorBackward = Range.isBackward({
    anchor: anchorSelection,
    focus: anchorNodeRange,
  });
  const isNodeFocusForward = _.isEqual(focusSelection, focusNodeRange)
    ? false
    : Range.isForward({
        anchor: focusSelection,
        focus: focusNodeRange,
      });

  return !(isNodeAnchorBackward || isNodeFocusForward);
};

export const deleteNode = (editor, element) => {
  const path = findElementPath(editor, element);
  Transforms.delete(editor, { at: path });
};

export const fullySelectedRange = (editor, range = editor.selection) => {
  let [[startingLeaf, startingPath], [endingLeaf, endingPath]] = [
    Editor.first(editor, range),
    Editor.last(editor, range),
  ];

  let startingPath2 = [...startingPath],
    endingPath2 = [...endingPath];

  switch (startingLeaf.parentType) {
    case "blockTitle":
    case "blockSubtext":
      startingPath2.splice(-2);
      break;
    default:
      startingPath2.pop();
      break;
  }

  switch (endingLeaf.parentType) {
    case "blockTitle":
    case "blockSubtext":
      endingPath2.splice(-2);
      break;
    default:
      endingPath2.pop();
      break;
  }

  const tmp = Editor.range(editor, startingPath2, endingPath2);
  console.log(tmp);
  return tmp;
};

//following function will set selected in the nodes included in editor.selection
export const getSelectedNodes = (editor) => {
  Transforms.select(editor, fullySelectedRange(editor));
  const selectedNodes = Editor.nodes(editor, {});

  for (const selectedNode of selectedNodes) {
    const [node, path] = selectedNode;
    if (_.includes(selectableNodeTypes, node.type)) {
      Transforms.setNodes(editor, { selected: true }, { at: path });
    }
  }

  //When multiple shift+click events occur we need to know the previous editor selection
  //so that it can be combined with the new selection
  Editor.rangeRef.current = _.cloneDeep(editor.selection);
};

export const removeSelectedProperty = (editor) => {
  const selectedNodes = Editor.nodes(editor, {
    at: [],
    match: (n) => n.selected,
  });

  for (const selectedNode of selectedNodes) {
    const [node, path] = selectedNode;
    if (_.includes(selectableNodeTypes, node.type)) {
      Transforms.setNodes(editor, { selected: false }, { at: path });
    }
  }
};

export const deleteSelectedNodes = (editor, element) => {
  if (!editor.selection) return;

  console.log(editor.selection);
  const range = Editor.range(editor, editor.selection);
  Transforms.delete(editor, { at: range });

  //dont know why but extra aiBlock element remains which needs to be deleted
  let elementPath = findElementPath(editor, element);
  Transforms.delete(editor, { at: decrementPath(elementPath) });
};

export const atleastOneNodeSelected = (editor) => {
  const selectedNodes = Editor.nodes(editor, {
    at: [],
    match: (n) => n.selected,
  });

  for (const selectedNode of selectedNodes) {
    return true;
  }

  return false;
};
