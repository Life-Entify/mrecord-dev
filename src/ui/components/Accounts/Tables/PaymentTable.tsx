import { Spin, Table, TableProps } from "antd";
import React from "react";
import { IPayment } from "../types";
import { getPaymentTableColumns } from "./data";
import { RenderedCell } from "rc-table/lib/interface";
import { ITxTableProps, TxTable } from "./TxTable";

export interface IPaymentTableProps {
  payments?: IPayment[];
  showTx?: boolean;
  tableProps?: Omit<TableProps<IPayment>, "columns" | "dataSource"> & {
    txSubTableProps?: Omit<ITxTableProps, "dataSource">;
    render?: (
      keyIndex: string
    ) => (
      value: any,
      record: IPayment,
      index: number
    ) => React.ReactNode | RenderedCell<IPayment>;
  };
}

export function PaymentTable({
  tableProps,
  payments,
  showTx = true,
}: IPaymentTableProps) {
  const { expandable, render, txSubTableProps, ...deepTableProps } =
    tableProps || {};
  return (
    <Table
      size="small"
      {...deepTableProps}
      columns={getPaymentTableColumns(render)}
      dataSource={payments}
      expandable={{
        expandedRowRender: showTx
          ? (record) => {
              return !record ? (
                <Spin />
              ) : (
                <TxTable
                  tableProps={{
                    dataSource: record.txs,
                    ...txSubTableProps,
                  }}
                />
              );
            }
          : undefined,
        ...expandable,
      }}
    />
  );
}
