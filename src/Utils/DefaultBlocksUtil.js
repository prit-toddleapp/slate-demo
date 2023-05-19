import { makeNodeId } from "../Plugins/WithNodeId";

export const DefaultBlock = {
  section: {
    id: makeNodeId(),
    type: "section",
    isCollapsed: false,
    children: [
      {
        type: "sectionHeader",
        children: [
          {
            text: "",
          },
        ],
      },
    ],
  },
  sectionHeader: {
    id: makeNodeId(),
    type: "sectionHeader",
    children: [
      {
        text: "",
      },
    ],
  },
  sectionBody: {
    id: makeNodeId(),
    type: "sectionBody",
    children: [
      {
        text: "",
      },
    ],
  },
  aiBlock: {
    id: makeNodeId(),
    type: "aiBlock",
    children: [
      {
        id: makeNodeId(),
        type: "blockTitle",
        children: [{ text: "" }],
      },
      {
        id: makeNodeId(),
        type: "blockSubtext",
        children: [{ text: "" }],
      },
    ],
  },
  resourceBlock: {
    id: makeNodeId(),
    type: "resourceBlock",
    iconUrl: "",
    children: [{ text: "" }],
  },
  blockTitle: {
    id: makeNodeId(),
    type: "blockTitle",
    children: [{ text: "" }],
  },
  blockSubtext: {
    id: makeNodeId(),
    type: "blockSubtext",
    children: [{ text: "" }],
  },
  paragraph: {
    id: makeNodeId(),
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
};

export const initialValue = [
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
            text: "This is the header",
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
                children: [{ text: "This is the title paragraph" }],
              },
              {
                id: makeNodeId(),
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
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
  {
    id: makeNodeId(),
    type: "section",
    isCollapsed: true,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        id: makeNodeId(),
        type: "sectionHeader",
        children: [
          {
            text: "This is the header",
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
                children: [{ text: "This is the title paragraph" }],
              },
              {
                id: makeNodeId(),
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
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

export const newBlockMenuOptions = [
  { key: "SHIFU", label: "Ask Shifu" },
  { key: "SECTION", label: "Add new section" },
];

export const menuOptions = {
  section: [
    { key: "SHIFU", label: "Ask Shifu", id: "SHIFU" },
    { key: "DUPLICATE", label: "Duplicate", id: "DUPLICATE" },
    { key: "DELETE", label: "Delete", id: "DELETE" },
    { key: "DELETE", label: "Delete Only Section", id: "DELETE" },
  ],
  aiBlock: [
    { key: "SHIFU", label: "Ask Shifu", id: "SHIFU" },
    { key: "DUPLICATE", label: "Duplicate", id: "DUPLICATE" },
    { key: "TURNINLE", label: "Turn In to LE", id: "TURNIN" },
    { key: "TURNINFA", label: "Turn In to FA", id: "TURNIN" },
    { key: "TURNINSA", label: "Turn In to SA", id: "TURNIN" },
    { key: "DELETE", label: "Delete", id: "DELETE" },
  ],
  resourceBlock: [
    { key: "DUPLICATE", label: "Duplicate", id: "DUPLICATE" },
    { key: "DELETE", label: "Delete", id: "DELETE" },
  ],
  paragraph: [
    { key: "SHIFU", label: "Ask Shifu" },
    { key: "DUPLICATE", label: "Duplicate" },
    { key: "TURNINSECTION", label: "Turn In to Section" },
    { key: "TURNINLE", label: "Turn In to LE" },
    { key: "TURNINFA", label: "Turn In to FA" },
    { key: "TURNINSA", label: "Turn In to SA" },
    { key: "DELETE", label: "Delete" },
  ],
  newBlock: [{ key: "DELETE", label: "Delete", id: "DELETE" }],
};

export const getMenuOptions = (type) => {
  if (menuOptions[type]) return menuOptions[type];
  else return menuOptions.newBlock;
};
