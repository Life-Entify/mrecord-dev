import { FORM_FIELD_TYPES, IFormItems } from "ui/common/views";
import type { TableColumnType } from "ui/common/base";
import { QPatient } from "app/graph.queries/patients/types";
import { QProfile } from "app/graph.queries/persons/types";

export const address: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "street",
      label: "Street",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "town",
      label: "Town",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "lga",
      label: "Local Government",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nstate",
      label: "State",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "country",
      label: "Country",
      rules: [{ required: true }],
    },
  },
];
export const patientForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "last_name",
      label: "Surname",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "first_name",
      label: "First Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "middle_name",
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
    itemProps: { name: "old_id", label: "Old Card Number" },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "national_identity", label: "National Identity (NIN)" },
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
    itemProps: { name: "email", label: "Email" },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: { name: "phone_number", label: "Phone" },
  },
  ...address,
];
export const nextOfKinForm = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nok_last_name",
      label: "Last Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nok_first_name",
      label: "First Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nok_phone_number",
      label: "Phone",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nok_email",
      label: "Email",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "nok_relationship",
      label: "relationship",
      rules: [{ required: true }],
    },
  },
  ...address.map((item) => ({
    ...item,
    itemProps: {
      ...item.itemProps,
      name: `nok_${item.itemProps?.name}`,
      rules: [],
    },
  })),
];
export const tableColumns: TableColumnType<QPatient>[] = [
  {
    key: "patient_id",
    fixed: "left",
    title(_: any) {
      return "Patient ID";
    },
    render(_, record) {
      return String(record.patient_id).padStart(4, "0");
    },
  },
  {
    key: "last_name",
    fixed: "left",
    title: "Last Name",
    render(_, record) {
      return record.person.profile.last_name;
    },
  },
  {
    key: "first_name",
    fixed: "left",
    title: "First Name",
    render(_, record) {
      return record.person.profile.first_name;
    },
  },
  {
    key: "gender",
    title: "Gender",
    render(_, record) {
      return record.person.profile.gender;
    },
  },
  {
    key: "dob",
    title: "Date of birth",
    render(_, record) {
      return record.person.profile.dob?.toLocaleString();
    },
  },
  {
    key: "phone_number",
    title: "Phone",
    render(_, record) {
      return record.person.profile.phone_number;
    },
  },
];
export const patientDataMapping: Record<
  keyof QPatient | keyof QProfile,
  string
> = {
  last_name: "Last Name",
  first_name: "First Name",
  middle_name: "Middle Name",
  gender: "Gender",
  old_id: "Old Patient ID",
  occupation: "Occupation",
  national_identity: "National ID",
  phone_number: "Phone Number",
  patient_id: "Patient ID",
  email: "Email",
  _id: "Generated ID",
  person: "",
  dob: "Date of Birth",
  addresses: "Address",
  next_of_kins: "Next of Kins",
};
