import { Spin, Table, TableProps } from "antd";
import React from "react";
import { IOrgBank, IPayment } from "../../types";
import { getPaymentTableColumns } from "../PaymentTable";
import { RenderedCell } from "rc-table/lib/interface";
import { ITxTableProps, TxTable } from "../TxTable";

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
  removeColumns?: (keyof IPayment)[];
  banks?: IOrgBank[];
}

export function PaymentTable({
  tableProps,
  payments,
  showTx = true,
  removeColumns,
  banks,
}: IPaymentTableProps) {
  const { expandable, render, txSubTableProps, ...deepTableProps } =
    tableProps || {};
  return (
    <Table
      scroll={{ x: true }}
      size="small"
      {...deepTableProps}
      columns={getPaymentTableColumns(removeColumns, render, banks)}
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
