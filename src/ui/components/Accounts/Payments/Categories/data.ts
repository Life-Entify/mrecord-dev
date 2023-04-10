import { FORM_FIELD_TYPES, IFormItems } from "ui/common";

export const categoryFormInputs: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "title",
      label: "Income Category",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Description",
      rules: [{ required: true }],
    },
  },
];
