import { TableColumnType } from "antd";
import React from "react";
import { ITx } from "../../types";
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
    key: "amount",
    dataIndex: "amount",
    fixed: "left",
    title(_) {
      return "Amount";
    },
    render: render?.("amount"),
  },
  {
    key: "remark",
    dataIndex: "remark",
    title: "Remarks",
    render: render?.("remark"),
  },
];
