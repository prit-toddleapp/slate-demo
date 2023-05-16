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
