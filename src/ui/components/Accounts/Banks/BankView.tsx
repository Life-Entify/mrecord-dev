import { Button, Divider, Space, Table, TableProps, Tooltip } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import {
  DeleteOutlined,
  EditOutlined,
  IInfoBoardProps,
  InfoBoard,
  IToolbarProps,
  Toolbar,
} from "ui/common";
import { BankTxType, IOrgBank, IBankTx } from "../types";
import { bankLabelMap, getBankTxTableColumns } from "./data";

const Root = styled.div``;

export interface IBankViewProps {
  bank?: IOrgBank;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IOrgBank>,
    "data" | "dataMap" | "skipMap"
  >;
  toolbarProps?: Omit<IToolbarProps, "dropdownProps"> & {
    onNewTransaction?: (key: BankTxType) => void;
  };
  tableProps?: Omit<TableProps<IBankTx>, "columns">;
}
interface IBankViewState {
  showDetail: boolean;
}
export function BankView({
  bank,
  infoBoardProps,
  toolbarProps,
  tableProps,
}: IBankViewProps) {
  const [state, _setState] = useState<Partial<IBankViewState>>({});
  const setState = (_state: Partial<IBankViewState>) =>
    _setState((state) => ({ ...state, ..._state }));
  const { onNewTransaction, ...deepToolbarProps } = toolbarProps || {};
  return (
    <Root>
      <Button
        size="small"
        style={{ marginBottom: 20 }}
        onClick={() => setState({ showDetail: !state.showDetail })}
      >
        {state.showDetail ? "Hide " : "Show "} Details
      </Button>
      {state.showDetail && (
        <>
          <InfoBoard<keyof IOrgBank>
            {...infoBoardProps}
            title={bank?.bank}
            data={bank}
            dataMap={bankLabelMap}
            skipMap={["_id"]}
          />
          <Divider style={{ marginTop: 50, marginBottom: 20 }} />
        </>
      )}
      <Toolbar
        {...deepToolbarProps}
        dropdownProps={{
          menu: {
            items: [
              {
                key: BankTxType.DEPOSIT,
                label: "Deposit",
              },
              {
                key: BankTxType.WITHDRAWAL,
                label: "Withdrawal",
              },
            ],
            onClick(event) {
              onNewTransaction?.(event.key as BankTxType);
            },
          },
          btnProps: {
            children: "New Transaction",
          },
        }}
      />
      <div style={{ marginTop: 50 }} />
      <Table
        {...tableProps}
        columns={getBankTxTableColumns((dataIndex) => (value, record) => {
          if (dataIndex === "action") {
            return (
              <Space>
                <Tooltip title="Edit transaction">
                  <EditOutlined
                    style={{ marginRight: 10 }}
                    size={12}
                    onClick={
                      () => {}
                      // onFundEdit?.(record, BANK_EDIT_ACTIONS.ADD)
                    }
                  />
                </Tooltip>
                <Tooltip title="Delete transaction">
                  <DeleteOutlined
                    size={12}
                    onClick={
                      () => {}
                      // onFundEdit?.(record, BANK_EDIT_ACTIONS.DEDUCT)
                    }
                  />
                </Tooltip>
              </Space>
            );
          }
          return value;
        })}
      />
    </Root>
  );
}
