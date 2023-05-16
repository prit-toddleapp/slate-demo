export const DefaultBlock = {
  section: {
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
    type: "sectionHeader",
    children: [
      {
        text: "",
      },
    ],
  },
  sectionBody: {
    type: "sectionBody",
    children: [
      {
        text: "",
      },
    ],
  },
  aiBlock: {
    type: "aiBlock",
    children: [
      {
        type: "blockTitle",
        children: [{ text: "" }],
      },
      {
        type: "blockSubtext",
        children: [{ text: "" }],
      },
    ],
  },
  resourceBlock: {
    type: "resourceBlock",
    iconUrl: "",
    children: [{ text: "" }],
  },
  blockTitle: {
    type: "blockTitle",
    children: [{ text: "" }],
  },
  blockSubtext: {
    type: "blockSubtext",
    children: [{ text: "" }],
  },
  paragraph: {
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
    type: "section",
    isCollapsed: false,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        type: "sectionHeader",
        children: [
          {
            text: "This is the header",
          },
        ],
      },
      {
        type: "sectionBody",
        //isCollapsed: false, is this appraoch better?
        children: [
          {
            type: "aiBlock",
            children: [
              {
                type: "blockTitle",
                children: [{ text: "This is the title paragraph" }],
              },
              {
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
              },
            ],
          },
          {
            type: "resourceBlock",
            iconUrl: "LE",
            children: [{ text: "Resource block" }],
          },
        ],
      },
    ],
  },
  {
    type: "section",
    isCollapsed: true,
    collapsedIcon: ">",
    expandedIcon: "V",
    children: [
      {
        type: "sectionHeader",
        children: [
          {
            text: "This is the header",
          },
        ],
      },
      {
        type: "sectionBody",
        //isCollapsed: false, is this appraoch better?
        children: [
          {
            type: "aiBlock",
            children: [
              {
                type: "blockTitle",
                children: [{ text: "This is the title paragraph" }],
              },
              {
                type: "blockSubtext",
                children: [{ text: "This is the subtext paragraph" }],
              },
            ],
          },
          {
            type: "resourceBlock",
            iconUrl: "LE",
            children: [{ text: "Resource block" }],
          },
        ],
      },
    ],
  },
];

export const menuOptions = {
  section: [
    { key: "SHIFU", label: "Ask Shifu", id: "SHIFU" },
    { key: "DUPLICATE", label: "Duplicate", id: "DUPLICATE" },
    { key: "DELETE", label: "Delete", id: "DELETE" },
  ],
  aiBlock: [
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
  newBlock: [{ key: "DELETE", label: "Delete", id: "DELETE" }],
};

export const getMenuOptions = (type) => {
  if (menuOptions[type]) return menuOptions[type];
  else return menuOptions.newBlock;
};
