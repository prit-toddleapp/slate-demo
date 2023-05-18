import { Editor, Transforms, Range } from "slate";
import { incrementPath } from "../Utils/Misc";
import _ from "lodash";

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
