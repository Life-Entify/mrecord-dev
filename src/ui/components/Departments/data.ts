import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { IDepartment } from "./types";
import { RenderedCell } from "rc-table/lib/interface";

export const departmentForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "name",
      label: "Department Name",
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
    fieldProps: {
      showCount: true,
      maxLength: 250,
    },
  },
];
export const getDepartmentTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IDepartment,
    index: number
  ) => React.ReactNode | RenderedCell<IDepartment>
): TableColumnType<IDepartment>[] => [
  {
    key: "name",
    dataIndex: "name",
    fixed: "left",
    title(props) {
      return "Name";
    },
    render: render?.("name"),
  },
  {
    key: "description",
    dataIndex: "description",
    title: "Description",
    render: render?.("description"),
  },
  {
    key: "action",
    dataIndex: "action",
    title: "Action",
    render: render?.("action"),
  },
];
