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
  ) => React.ReactNode | RenderedCell<ITx>,
  removeColumns?: (keyof ITx)[]
): TableColumnType<ITx>[] => {
  const columns: TableColumnType<ITx>[] = [
    {
      key: "created_at",
      dataIndex: "created_at",
      fixed: "left",
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
      render(value, record, index) {
        if (record.category) {
          value = record.category.title;
        }
        return render?.("category_id")(value, record, index) || value;
      },
    },
    {
      key: "amount",
      dataIndex: "amount",
      fixed: "left",
      title(_) {
        return "Amount";
      },
      render(value, record, index) {
        value = Number(value).toLocaleString();
        return render?.("amount")(value, record, index) || value;
      },
    },
    {
      key: "action",
      dataIndex: "action",
      title: "Action",
      render: render?.("action"),
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
