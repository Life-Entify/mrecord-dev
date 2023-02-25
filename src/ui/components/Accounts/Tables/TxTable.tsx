import { Table, TableProps } from "antd";
import React from "react";
import { ITx } from "../types";
import { getTxTableColumns } from "./data";
import { RenderedCell } from "rc-table/lib/interface";

export interface ITxTableProps {
  tableProps?: Omit<TableProps<ITx>, "columns">;
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: ITx,
    index: number
  ) => React.ReactNode | RenderedCell<ITx>;
}

export function TxTable({ tableProps, render }: ITxTableProps) {
  return (
    <Table {...tableProps} columns={getTxTableColumns(render)} size="small" />
  );
}
