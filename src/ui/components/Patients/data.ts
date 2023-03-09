import { FORM_FIELD_TYPES, IFormItems } from "ui/common/views";
import type { TableColumnType } from "ui/common/base";
import { QPatient } from "app/graph.queries/patients/types";
import { QProfile } from "app/graph.queries/persons/types";
import { personDataMapping, personForm } from "../Person/data";
import { IPatient } from "./types";
import { RenderedCell } from "rc-table/lib/interface";
import { IPerson, IProfile } from "../Person";
import React from "react";

export const patientFormFields = personForm.unshift({
  fieldType: FORM_FIELD_TYPES.TEXT,
  itemProps: {
    name: "old_id",
    label: "Old Patient ID",
    rules: [{ required: true }],
  },
});
const defaultRender = (keyIndex: string, record: IPatient) => {
  type skipKey = keyof (IPatient & IPerson & IProfile);
  const skips: skipKey[] = ["person", "addresses", "next_of_kins"];
  if (!skips.includes(keyIndex as skipKey)) {
    return (record[keyIndex as keyof IPatient] ||
      record.person?.[keyIndex as keyof IPerson] ||
      record.person?.profile?.[keyIndex as keyof IProfile]) as React.ReactNode;
  }
  return null;
};
export const getPatientColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPatient,
    index: number
  ) => React.ReactNode | RenderedCell<IPatient>
): TableColumnType<IPatient>[] => [
  {
    key: "patient_id",
    fixed: "left",
    title(_: any) {
      return "Patient ID";
    },
    render(_, record, index) {
      if (render) {
        return render("patient_id")(
          String(defaultRender("patient_id", record)).padStart(6, "0"),
          record,
          index
        );
      }
      return defaultRender("patient_id", record);
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
export const patientDataMapping: Record<
  keyof (IPatient & Omit<IPerson, "_id"> & IProfile),
  string
> = {
  old_id: "Old Patient ID",
  patient_id: "Patient ID",
  person: "Person",
  ...{ ...personDataMapping, _id: "Patient ID" },
};
