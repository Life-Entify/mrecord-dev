import { FORM_FIELD_TYPES, IFormItems } from "ui/common/views";
import type { TableColumnType } from "ui/common/base";
import { IPerson, IProfile } from "./types";
import { RenderedCell } from "rc-table/lib/interface";

export const addressForm: IFormItems[] = [
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
export const personForm: IFormItems[] = [
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
  ...addressForm,
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
  ...addressForm.map((item) => ({
    ...item,
    itemProps: {
      ...item.itemProps,
      name: `nok_${item.itemProps?.name}`,
      rules: [],
    },
  })),
];
const defaultRender = (keyIndex: string, record: IPerson) => {
  type skipKey = keyof (IPerson & IProfile);
  const skips: skipKey[] = ["addresses", "next_of_kins"];
  if (!skips.includes(keyIndex as skipKey)) {
    return (record[keyIndex as keyof IPerson] ||
      record.profile?.[keyIndex as keyof IProfile]) as React.ReactNode;
  }
  return null;
};
export const getPersonTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPerson,
    index: number
  ) => React.ReactNode | RenderedCell<IPerson>
): TableColumnType<IPerson>[] => [
  {
    key: "person_id",
    fixed: "left",
    title: "ID",
    render(_, record, index) {
      if (render) {
        return render("person_id")(
          String(defaultRender("person_id", record)).padStart(6, "0"),
          record,
          index
        );
      }
      return defaultRender("person_id", record);
    },
  },
  {
    key: "last_name",
    fixed: "left",
    title: "Last Name",
    render(_, record, index) {
      if (render) {
        return render("last_name")(
          defaultRender("last_name", record),
          record,
          index
        );
      }
      return defaultRender("last_name", record);
    },
  },
  {
    key: "first_name",
    fixed: "left",
    title: "First Name",
    render(_, record, index) {
      if (render) {
        return render("first_name")(
          defaultRender("first_name", record),
          record,
          index
        );
      }
      return defaultRender("first_name", record);
    },
  },
  {
    key: "gender",
    title: "Gender",
    render(_, record, index) {
      if (render) {
        return render("gender")(defaultRender("gender", record), record, index);
      }
      return defaultRender("gender", record);
    },
  },
  {
    key: "dob",
    title: "Date of birth",
    render(_, record, index) {
      if (render) {
        return render("dob")(defaultRender("dob", record), record, index);
      }
      return defaultRender("dob", record);
    },
  },
  {
    key: "phone_number",
    title: "Phone",
    render(_, record, index) {
      if (render) {
        return render("phone_number")(
          defaultRender("phone_number", record),
          record,
          index
        );
      }
      return defaultRender("phone_number", record);
    },
  },
];
export const personDataMapping: Record<keyof (IPerson & IProfile), string> = {
  last_name: "Last Name",
  first_name: "First Name",
  middle_name: "Middle Name",
  gender: "Gender",
  occupation: "Occupation",
  national_identity: "National ID",
  phone_number: "Phone Number",
  email: "Email",
  _id: "Generated ID",
  dob: "Date of Birth",
  addresses: "Address",
  person_id: "Person ID",
  next_of_kins: "Next of Kins (ID)",
  next_of_kins_details: "Next of Kin (Details)",
  profile: "Profile",
  bank: "Bank",
};
