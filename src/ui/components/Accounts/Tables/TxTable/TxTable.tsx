import { Button, Space, Table, TableProps, Tooltip } from "antd";
import React from "react";
import { ITx } from "../../types";
import { getTxTableColumns } from "./data";
import { RenderedCell } from "rc-table/lib/interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export interface ITxTableProps {
  tableProps?: Omit<TableProps<ITx>, "columns">;
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: ITx,
    index: number
  ) => React.ReactNode | RenderedCell<ITx>;
  removeColumns?: (keyof ITx)[];
  onShowReceipt?: React.MouseEventHandler;
  onEditTx?: (tx: ITx) => void;
  onDeleteTx?: (tx: ITx) => void;
}

export function TxTable({
  tableProps,
  render,
  removeColumns,
  onShowReceipt,
  onEditTx,
  onDeleteTx,
}: ITxTableProps) {
  return (
    <>
      <Table
        {...tableProps}
        columns={getTxTableColumns(
          (keyIndex) => (value, record, index) => {
            if (keyIndex === "action") {
              return (
                <Space>
                  <Tooltip title="Edit Transaction">
                    <EditOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() => onEditTx?.(record)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Transaction">
                    <DeleteOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() => onDeleteTx?.(record)}
                    />
                  </Tooltip>
                </Space>
              );
            }
            return render?.(keyIndex)(value, record, index) || value;
          },
          removeColumns
        )}
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
