import _ from "lodash";
import { getSelectedNodeTypes } from "../Plugins";
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
            parentType: "sectionHeader",
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
        parentType: "sectionHeader",
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
    type: "newBlock",
    children: [
      {
        text: "",
      },
      // {
      //   id: makeNodeId(),
      //   type: "sectionHeader",
      //   children: [
      //     {
      //       text: "This is the header",
      //       parentType: "sectionHeader",
      //     },
      //   ],
      // },
      // {
      //   id: makeNodeId(),
      //   type: "sectionBody",
      //   //isCollapsed: false, is this appraoch better?
      //   children: [
      //     {
      //       id: makeNodeId(),
      //       type: "aiBlock",
      //       children: [
      //         {
      //           id: makeNodeId(),
      //           type: "blockTitle",
      //           children: [
      //             {
      //               text: "This is the title paragraph",
      //               parentType: "blockTitle",
      //             },
      //           ],
      //         },
      //         {
      //           id: makeNodeId(),
      //           type: "blockSubtext",
      //           children: [{ text: "subtext", parentType: "blockSubtext" }],
      //         },
      //       ],
      //     },
      //     {
      //       id: makeNodeId(),
      //       type: "aiBlock",
      //       children: [
      //         {
      //           id: makeNodeId(),
      //           type: "blockTitle",
      //           children: [
      //             {
      //               text: "ASD This is the title paragraph",
      //               parentType: "blockTitle",
      //             },
      //           ],
      //         },
      //         {
      //           id: makeNodeId(),
      //           type: "blockSubtext",
      //           children: [{ text: "ASD subtext", parentType: "blockSubtext" }],
      //         },
      //       ],
      //     },
      //     {
      //       id: makeNodeId(),
      //       type: "aiBlock",
      //       children: [
      //         {
      //           id: makeNodeId(),
      //           type: "blockTitle",
      //           children: [
      //             {
      //               text: "QWE This is the title paragraph",
      //               parentType: "blockTitle",
      //             },
      //           ],
      //         },
      //         {
      //           id: makeNodeId(),
      //           type: "blockSubtext",
      //           children: [{ text: "QWE subtext", parentType: "blockSubtext" }],
      //         },
      //       ],
      //     },
      //     {
      //       id: makeNodeId(),
      //       type: "resourceBlock",
      //       iconUrl: "LE",
      //       children: [{ text: "Resource block", parentType: "resourceBlock" }],
      //     },
      //   ],
      // },
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
            parentType: "sectionHeader",
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
                    text: "This is the title paragraph",
                    parentType: "blockTitle",
                  },
                ],
              },
              {
                id: makeNodeId(),
                type: "blockSubtext",
                children: [
                  {
                    text: "This is the subtext paragraph",
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
            children: [{ text: "Resource block", parentType: "resourceBlock" }],
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
    { key: "DELETE_SECTION", label: "Delete Only Section", id: "DELETE" },
  ],
  sectionHeader: [
    { key: "SHIFU", label: "Ask Shifu", id: "SHIFU" },
    { key: "DUPLICATE", label: "Duplicate", id: "DUPLICATE" },
    { key: "DELETE", label: "Delete", id: "DELETE" },
    { key: "DELETE_SECTION", label: "Delete Only Section", id: "DELETE" },
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

export const getMenuOptions = (type, editor) => {
  const selectedNodeTypes = getSelectedNodeTypes(editor);
  if (_.isEmpty(selectedNodeTypes) && !menuOptions[type])
    return menuOptions.newBlock;
  selectedNodeTypes.push(type);
  let options = menuOptions[type];
  _.forEach(selectedNodeTypes, (nodeType) => {
    if (menuOptions[nodeType])
      options = _.intersectionBy(options, menuOptions[nodeType], "key");
  });
  return options;
};
