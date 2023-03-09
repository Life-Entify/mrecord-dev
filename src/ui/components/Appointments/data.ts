import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { IDepartment } from "../Departments";
import { RenderedCell } from "rc-table/lib/interface";
import { IAppointment } from "./types";

export const getAppointmentForm = (
  departments?: IDepartment[]
): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.DATE,
    itemProps: {
      name: "date",
      label: "Appointment Date",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "department_id",
      label: "Department",
      rules: [{ required: true }],
    },
    fieldProps: {
      options: departments?.map((dept) => ({
        label: dept.name,
        value: dept._id as string,
      })),
    },
  },
];

export const getAppointmentTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IAppointment,
    index: number
  ) => React.ReactNode | RenderedCell<IAppointment>
): TableColumnType<IAppointment>[] => [
  {
    key: "_id",
    dataIndex: "_id",
    fixed: "left",
    title(props) {
      return "ID";
    },
    render: render?.("_id"),
  },
  {
    key: "patient",
    dataIndex: "patient",
    title: "Patient",
    render(value, record, index) {
      const { last_name, first_name } = record?.patient?.person?.profile || {};
      const name = last_name + " " + first_name;
      return render?.("patient")(value, record, index) || name;
    },
  },
  {
    key: "department",
    dataIndex: "department",
    title: "Department",
    render(value, record, index) {
      return (
        render?.("department")(value, record, index) || record?.department?.name
      );
    },
  },
  {
    key: "date",
    dataIndex: "date",
    title: "Appointment Date",
    render: render?.("date"),
  },
];
