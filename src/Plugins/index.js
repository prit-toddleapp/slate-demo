import { Node, Editor, Transforms } from "slate";

export const findElementPath = (editor, path = [], element) => {
  console.log(editor);
  console.log({ editor, element });
  if (editor === element) {
    return path;
  }
  if (editor.children)
    for (let i = 0; i < editor.children.length; i++) {
      const childPath = [...path, i];
      const child = editor.children[i];

      if (Node.isNode(child)) {
        const foundPath = findElementPath(child, childPath, element);
        if (foundPath) {
          return foundPath;
        }
      }
    }

  return null;
};

export const updateNodeChildren = (editor, path, newChildren) => {
  const range = Editor.range(editor, path);
  Transforms.delete(editor, { at: range });

  for (let i = 0; i < newChildren.length; i++) {
    const child = newChildren[i];
    Transforms.insertNodes(editor, child, { at: [...path, i] });
  }
};
