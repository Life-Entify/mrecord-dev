import { TableColumnType } from "antd";
import React from "react";
import { IPayment, ITx } from "../types";
import { RenderedCell } from "rc-table/lib/interface";

export const getTxTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: ITx,
    index: number
  ) => React.ReactNode | RenderedCell<ITx>
): TableColumnType<ITx>[] => [
  {
    key: "created_at",
    dataIndex: "created_at",
    fixed: "left",
    title(props) {
      return "Date";
    },
    render: render?.("created_at"),
  },
  {
    key: "tx_type",
    dataIndex: "tx_type",
    fixed: "left",
    title(props) {
      return "Tx Type";
    },
    render: render?.("tx_type"),
  },
  {
    key: "category_id",
    dataIndex: "category_id",
    fixed: "left",
    title(_) {
      return "Category";
    },
    render: render?.("category_id"),
  },
  {
    key: "remark",
    dataIndex: "remark",
    title: "Remarks",
    render: render?.("remark"),
  },
];
export const getPaymentTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IPayment,
    index: number
  ) => React.ReactNode | RenderedCell<IPayment>
): TableColumnType<IPayment>[] => [
  {
    key: "created_at",
    dataIndex: "created_at",
    fixed: "left",
    title(props) {
      return "Date";
    },
    render: render?.("created_at"),
  },
  {
    key: "tx_type",
    dataIndex: "tx_type",
    fixed: "left",
    title(props) {
      return "Tx Type";
    },
    render: render?.("tx_type"),
  },
  {
    key: "staff_id",
    dataIndex: "staff_id",
    fixed: "left",
    title(_) {
      return "Received By";
    },
    render: render?.("staff_id"),
  },
  {
    key: "person_id",
    dataIndex: "person_id",
    title: "Client",
    render: render?.("person_id"),
  },
  {
    key: "amount",
    dataIndex: "total_amount",
    title: "Amount",
    render: render?.("amount"),
  },
];
