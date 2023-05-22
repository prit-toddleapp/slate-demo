import { makeNodeId } from "../Plugins/WithNodeId";

const singleNodeAiBlock = [
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "New title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        children: [{ text: "New subtext added!!", parentType: "blockSubtext" }],
      },
    ],
  },
];

const doubleNodeAiBlock = [
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "New title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        children: [{ text: "New subtext added!!", parentType: "blockSubtext" }],
      },
    ],
  },
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "Second title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        children: [
          { text: "Second subtext added!!", parentType: "blockSubtext" },
        ],
      },
    ],
  },
];

const tripleNodeAiBlock = [
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "New title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        num: "sub1",
        children: [{ text: "New subtext added!!", parentType: "blockSubtext" }],
      },
    ],
  },
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "Second title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        num: "sub2",
        children: [
          { text: "Second subtext added!!", parentType: "blockSubtext" },
        ],
      },
    ],
  },
  {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "Third title added!!", parentType: "blockTitle" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        num: "sub3",
        children: [
          { text: "Third subtext added!!", parentType: "blockSubtext" },
        ],
      },
    ],
  },
];

const singleNodeLeBlock = [
  {
    id: makeNodeId(),
    type: "resourceBlock",
    iconUrl: "LE",
    children: [{ text: "New LE added!!" }],
  },
];

const singleSectionBlock = [
  {
    id: makeNodeId(),
    type: "section",
    isCollapsed: false,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        id: makeNodeId(),
        type: "sectionHeader",
        children: [
          {
            text: "New section title",
          },
        ],
      },
      {
        id: makeNodeId(),
        type: "sectionBody",
        //isCollapsed: false, is this appraoch better?
        children: [
          {
            id: makeNodeId(),
            type: "aiBlock",
            children: [
              {
                id: makeNodeId(),
                type: "blockTitle",
                children: [
                  {
                    text: "ABC",
                    parentType: "blockTitle",
                  },
                ],
              },
              {
                id: makeNodeId(),
                type: "blockSubtext",
                children: [
                  {
                    text: "XYZ",
                    parentType: "blockSubtext",
                  },
                ],
              },
            ],
          },
          {
            id: makeNodeId(),
            type: "resourceBlock",
            iconUrl: "LE",
            children: [{ text: "Resource block" }],
          },
        ],
      },
    ],
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
    case "sec1":
      return singleSectionBlock;
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
