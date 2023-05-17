import { Editor, Transforms } from "slate";
import { incrementPath } from "../Utils/Misc";

export const findElementPath = (editor, element) => {
  const [match] = Editor.nodes(editor, {
    at: [],
    match: (n) => n === element,
  });
  console.log(match[1]);
  return match ? match[1] : null;
};

export const updateNodeChildren = (editor, path, newChildren) => {
  const range = Editor.range(editor, path);
  Transforms.delete(editor, { at: range });

  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    Transforms.insertNodes(editor, child, { at: [...path, i] });
  }
};

export const turnInElement = (editor, element, iconType) => {
  const path = findElementPath(editor, element);
  updateNodeChildren(editor, path, element.children[0].children);
  Transforms.setNodes(
    editor,
    {
      type: "resourceBlock",
      iconUrl: iconType,
    },
    { at: path }
  );
};

export const addNewBlock = (editor, element) => {
  const newBlock = {
    type: "newBlock",
    children: [
      {
        text: "",
      },
    ],
  };
  const path = findElementPath(editor, element);
  Transforms.insertNodes(editor, newBlock, { at: incrementPath(path) });
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
