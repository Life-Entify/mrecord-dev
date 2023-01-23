import { FORM_FIELD_TYPES, IFormItems } from "ui/common/views";

export const patientForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "surname",
      label: "Surname",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "firstname",
      label: "First Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "middlename",
      label: "Middle Name",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "gender",
      label: "Gender",
      rules: [{ required: true }],
    },
    fieldProps: {
      options: [
        { value: "m", label: "Male" },
        { value: "f", label: "Female" },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "oldId", label: "Old Card Number" },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "occupation", label: "Occupation" },
  },
  {
    fieldType: FORM_FIELD_TYPES.DATE,
    itemProps: { name: "dob", label: "Date of Birth" },
  },

  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "address",
      label: "Address",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "email", label: "Email" },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "phone", label: "Phone" },
  },
];

export const nextOfKinForm = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "nokName", label: "Next of kin Name" },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nokAddress",
      label: "Address (Next of kin)",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nokPhone",
      label: "Phone (Next of kin)",
    },
  },
];
