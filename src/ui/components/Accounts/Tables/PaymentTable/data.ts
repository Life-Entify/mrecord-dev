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
      render: render?.("person_id"),
    },
    {
      key: "amount",
      dataIndex: "total_amount",
      title: "Amount",
      fixed: "left",
      render: render?.("amount"),
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
      key: "staff_id",
      dataIndex: "staff_id",
      title(_) {
        return "Received By";
      },
      render: render?.("staff_id"),
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title(props) {
        return "Date";
      },
      render: render?.("created_at"),
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
