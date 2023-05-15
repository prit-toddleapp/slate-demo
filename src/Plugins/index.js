import { Node } from "slate";

export const findElementPath = (editor, path = [], element) => {
  console.log(editor);
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
