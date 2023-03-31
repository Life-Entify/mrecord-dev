import { TableColumnType } from "antd";
import { IPayroll, IPaySlip } from "../types";
import { RenderedCell } from "rc-table/lib/interface";
import { IEmployee } from "ui/components/Employees/Employee";

export const getPaySlipTableColumns = (
  removeColumns?: (keyof IPaySlip)[],
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPaySlip,
    index: number
  ) => React.ReactNode | RenderedCell<IPaySlip>
): TableColumnType<IPaySlip>[] => {
  const columns: TableColumnType<IPaySlip>[] = [
    {
      key: "_id",
      dataIndex: "_id",
      title: "ID",
      fixed: "left",
      render: render?.("_id"),
    },
    {
      key: "employee_id",
      dataIndex: "employee_id",
      title: "Staff ID",
      fixed: "left",
      render: render?.("employee_id"),
    },
    {
      key: "staff",
      dataIndex: "staff",
      title(props) {
        return "Staff";
      },
      render(_, record, index) {
        const { last_name, first_name } = record?.staff?.person?.profile || {};
        const name = `${last_name || ""} ${first_name || ""}`;
        return render?.("staff")(name, record, index) || name;
      },
    },
    {
      key: "bonus_amount",
      dataIndex: "bonus_amount",
      title(_) {
        return "Bonuses";
      },
      render: render?.("bonus_amount"),
    },
    {
      key: "deducted_amount",
      dataIndex: "deducted_amount",
      title(_) {
        return "Amount";
      },
      render: render?.("deducted_amount"),
    },
    {
      key: "amount",
      dataIndex: "amount",
      title(_) {
        return "Amount";
      },
      render(_, record, index) {
        const amount =
          (record.bonus_amount || 0) - (record.deducted_amount || 0);
        return (
          render?.("amount")(amount, record, index) ||
          Number(amount).toLocaleString()
        );
      },
    },
    {
      key: "slip",
      dataIndex: "slip",
      title: "Amount",
      render: render?.("slip"),
    },
  ];
  if (removeColumns && removeColumns.length > 0) {
    for (let i = 0; i < removeColumns.length; i++) {
      const key = removeColumns[i];
      const index = columns.findIndex((item) => item.dataIndex === key);
      if (index !== -1) {
        columns.splice(index, 1);
      }
    }
  }
  return columns;
};
export const getPayrollTableColumns = (
  removeColumns?: (keyof IPayroll)[],
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPayroll,
    index: number
  ) => React.ReactNode | RenderedCell<IPayroll>
): TableColumnType<IPayroll>[] => {
  const columns: TableColumnType<IPayroll>[] = [
    {
      key: "_id",
      dataIndex: "_id",
      title: "ID",
      fixed: "left",
      render: render?.("_id"),
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Name",
      fixed: "left",
      render: render?.("name"),
    },
    {
      key: "description",
      dataIndex: "description",
      title(props) {
        return "Description";
      },
      render: render?.("description"),
    },
    {
      key: "total_amount",
      dataIndex: "total_amount",
      title(_) {
        return "Amount";
      },
      render: render?.("total_amount"),
    },
  ];
  if (removeColumns && removeColumns.length > 0) {
    for (let i = 0; i < removeColumns.length; i++) {
      const key = removeColumns[i];
      const index = columns.findIndex((item) => item.dataIndex === key);
      if (index !== -1) {
        columns.splice(index, 1);
      }
    }
  }
  return columns;
};
