const singleNodeAiBlock = [
  {
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
  },
];

const doubleNodeAiBlock = [
  {
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
  },
  {
    type: "aiBlock",
    children: [
      {
        type: "blockTitle",
        children: [{ text: "Second title added!!" }],
      },
      {
        type: "blockSubtext",
        children: [{ text: "Second subtext added!!" }],
      },
    ],
  },
];

const tripleNodeAiBlock = [
  {
    type: "aiBlock",
    children: [
      {
        type: "blockTitle",
        children: [{ text: "New title added!!" }],
      },
      {
        type: "blockSubtext",
        num: "sub1",
        children: [{ text: "New subtext added!!" }],
      },
    ],
  },
  {
    type: "aiBlock",
    children: [
      {
        type: "blockTitle",
        children: [{ text: "Second title added!!" }],
      },
      {
        type: "blockSubtext",
        num: "sub2",
        children: [{ text: "Second subtext added!!" }],
      },
    ],
  },
  {
    type: "aiBlock",
    children: [
      {
        type: "blockTitle",
        children: [{ text: "Third title added!!" }],
      },
      {
        type: "blockSubtext",
        num: "sub3",
        children: [{ text: "Third subtext added!!" }],
      },
    ],
  },
];

const singleNodeLeBlock = [
  {
    type: "resourceBlock",
    iconUrl: "LE",
    children: [{ text: "New LE added!!" }],
  },
];

export const getSectionFromInputText = (inputText) => {
  switch (inputText) {
    case "ai":
      return singleNodeAiBlock;
    case "le":
      return singleNodeLeBlock;
    case "ai2":
      return doubleNodeAiBlock;
    case "ai3":
      return tripleNodeAiBlock;
    default:
      return null;
  }
};

export const incrementPath = (path, n = 1) => {
  const newPath = [...path];
  newPath[newPath.length - 1] += n;
  return newPath;
};

export const decrementPath = (path, n = 1) => {
  const newPath = [...path];
  newPath[newPath.length - 1] -= n;
  if (newPath[newPath.length - 1] < 0) {
    newPath[newPath.length - 1] = 0;
  }

  return newPath;
};

export const selectableNodeTypes = [
  "sectionHeader",
  "aiBlock",
  "resourceBlock",
];
