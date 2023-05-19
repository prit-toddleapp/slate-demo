import { Editor, Transforms } from "slate";
import { incrementPath } from "../Utils/Misc";
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
