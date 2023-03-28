import type { TableColumnType } from "ui/common/base";
import { personDataMapping, personForm } from "../../Person/data";
import { IEmployee } from "../types";
import { RenderedCell } from "rc-table/lib/interface";
import { IPerson, IProfile } from "../../Person";
import React from "react";

export const staffFormFields = personForm;
const defaultRender = (keyIndex: string, record: IEmployee) => {
  type skipKey = keyof (IEmployee & IPerson & IProfile);
  const skips: skipKey[] = ["person", "addresses", "next_of_kins"];
  if (!skips.includes(keyIndex as skipKey)) {
    return (record[keyIndex as keyof IEmployee] ||
      record.person?.[keyIndex as keyof IPerson] ||
      record.person?.profile?.[keyIndex as keyof IProfile]) as React.ReactNode;
  }
  return null;
};
export const getStaffColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IEmployee,
    index: number
  ) => React.ReactNode | RenderedCell<IEmployee>
): TableColumnType<IEmployee>[] => [
  {
    key: "employee_id",
    fixed: "left",
    title(_: any) {
      return "Staff ID";
    },
    render(_, record, index) {
      if (render) {
        return render("employee_id")(
          String(defaultRender("employee_id", record)).padStart(4, "0"),
          record,
          index
        );
      }
      return String(defaultRender("employee_id", record)).padStart(4, "0");
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
export const staffDataMapping: Record<
  keyof (IEmployee & Omit<IPerson, "_id"> & IProfile),
  string
> = {
  employee_id: "Staff ID",
  person: "Person",
  ...{ ...personDataMapping, _id: "Staff ID (Gen)" },
  departments: "Departments",
  department_ids: "Departments",
  logins: "",
};
