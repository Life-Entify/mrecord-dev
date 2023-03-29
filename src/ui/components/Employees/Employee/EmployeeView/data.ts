import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { ILogin } from "../../types";
import { RenderedCell } from "rc-table/lib/interface";
import { IDepartment } from "ui/components/Departments";

export const loginForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "username",
      label: "Username",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "password",
      label: "Password",
      rules: [{ required: true }],
    },
    fieldProps: {
      type: "password",
    },
  },
];

export const getLoginColumns = (
  departments?: IDepartment[],
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: ILogin,
    index: number
  ) => React.ReactNode | RenderedCell<ILogin>
): TableColumnType<ILogin>[] => [
  {
    key: "department_id",
    fixed: "left",
    title: "Department",
    render(value: ILogin) {
      const dept = departments?.find(
        (item) => item._id === value.department_id
      );
      // console.log(dept, value, departments);
      return dept?.name;
    },
  },
  {
    key: "username",
    title: "Username",
    render(value: ILogin) {
      return value.username;
    },
  },
  {
    key: "password",
    title: "Password",
    render() {
      return "*******";
    },
  },
  {
    key: "action",
    title: "Action",
    render: render?.("action"),
  },
];
