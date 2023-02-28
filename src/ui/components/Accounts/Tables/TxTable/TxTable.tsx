import { Button, Table, TableProps } from "antd";
import React from "react";
import { ITx } from "../../types";
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
  onShowReceipt?: React.MouseEventHandler;
}

export function TxTable({ tableProps, render, onShowReceipt }: ITxTableProps) {
  return (
    <>
      <Table
        {...tableProps}
        columns={getTxTableColumns(render)}
        size="small"
        scroll={{ x: true }}
      />
      {!!onShowReceipt && (
        <Button
          onClick={onShowReceipt}
          type="primary"
          style={{ marginTop: 20 }}
        >
          Show Receipt
        </Button>
      )}
    </>
  );
}
