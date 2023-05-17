const singleNodeAiBlock = {
  type: "aiBlock",
  children: [
    {
      type: "blockTitle",
      children: [{ text: "New title added!!" }],
    },
    {
      type: "blockSubtext",
      children: [{ text: "New subtext added!!" }],
    },
  ],
};

const singleNodeLeBlock = {
  type: "resourceBlock",
  iconUrl: "LE",
  children: [{ text: "New LE added!!" }],
};

export const getSectionFromInputText = (inputText) => {
  switch (inputText) {
    case "ai":
      return singleNodeAiBlock;
    case "le":
      return singleNodeLeBlock;
    default:
      return null;
  }
};

export const incrementPath = (path) => {
  const newPath = [...path];
  newPath[newPath.length - 1] += 1;
  return newPath;
};

export const decrementPath = (path) => {
  const newPath = [...path];
  newPath[newPath.length - 1] -= 1;
  if (newPath[newPath.length - 1] < 0) {
    newPath[newPath.length - 1] = 0;
  }
  console.log(newPath);
  return newPath;
};
