import { Editor, Transforms } from "slate";

export const findElementPath = (editor, element) => {
  const [match] = Editor.nodes(editor, {
    at: [],
    match: (n) => n === element,
  });
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
