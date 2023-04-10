import { IPayment } from "../../types";
import { RenderedCell } from "rc-table/lib/interface";
import { TableColumnType } from "antd";
import React from "react";

export const getPaymentTableColumns = (
  removeColumns?: (keyof IPayment)[],
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPayment,
    index: number
  ) => React.ReactNode | RenderedCell<IPayment>
): TableColumnType<IPayment>[] => {
  const columns: TableColumnType<IPayment>[] = [
    {
      key: "person_id",
      dataIndex: "person_id",
      title: "Client",
      fixed: "left",
      render(value, record, index) {
        const { last_name, first_name } = record?.person?.profile || {};
        value = `${last_name} ${first_name}`;
        return render?.("person_id")(value, record, index) || value;
      },
    },
    {
      key: "total_amount",
      dataIndex: "total_amount",
      title: "Amount",
      fixed: "left",
      render(value, record, index) {
        value = Number(value).toLocaleString();
        return render?.("total_amount")(value, record, index) || value;
      },
    },
    {
      key: "tx_type",
      dataIndex: "tx_type",
      title(props) {
        return "Tx Type";
      },
      render: render?.("tx_type"),
    },
    {
      key: "action_type",
      dataIndex: "action_type",
      title(props) {
        return "Tx Action";
      },
      render: render?.("action_type"),
    },
    {
      key: "employee_id",
      dataIndex: "employee_id",
      title(_) {
        return "Received By";
      },
      render(value, record, index) {
        const { last_name, first_name } =
          record?.employee?.person?.profile || {};
        if (last_name) {
          value = `${last_name} ${first_name}`;
        }
        return render?.("employee_id")(value, record, index) || value;
      },
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title(props) {
        return "Date";
      },
      render(value, record, index) {
        if (value) {
          value = new Date(Number(value)).toLocaleDateString();
        }
        return render?.("created_at")(value, record, index) || value;
      },
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
