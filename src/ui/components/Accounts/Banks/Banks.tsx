import {
  Button,
  Drawer,
  DrawerProps,
  Space,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { BankTxType, IBank } from "../types";
import { getBankTableColumns } from "./data";
import { INewBankProps, NewBank } from "./NewBank";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BankFundChange, IBankFundChangeProps } from "./FundChange";
import { BankView, IBankViewProps } from "./BankView";
import { INewBankDepositTxProps, NewBankDepositTx } from "./NewBankTx";
import {
  INewBankWithdrawalTxProps,
  NewBankWithdrawalTx,
} from "./NewBankTx/Withdrawal";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum BANK_DIALOG_TYPE {
  FUND_CHANGE = 1,
  NEW_BANK = 2,
  VIEW_BANK = 3,
  NEW_BANK_TX_DEPOSIT = 4,
  NEW_BANK_TX_WITHDRAWAL = 5,
}
export interface IBanksProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & {
    drawerType?: BANK_DIALOG_TYPE;
  };
  newBankProps?: INewBankProps;
  tableProps?: Omit<TableProps<IBank>, "columns"> & {
    onFundEdit?: (record: IBank, action: BankTxType) => void;
  };
  fundChangeProps?: IBankFundChangeProps;
  bankTxProps?: IBankViewProps & { onBack?: React.MouseEventHandler };
  newBankTxProps?: {
    depositProps?: INewBankDepositTxProps;
    withdrawalProps?: INewBankWithdrawalTxProps;
  };
}

export function Banks({
  drawerProps,
  toolbarProps,
  newBankProps,
  tableProps,
  fundChangeProps,
  bankTxProps,
  newBankTxProps,
}: IBanksProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onFundEdit, ...deepTableProps } = tableProps || {};
  const { onBack, ...deepBankTxProps } = bankTxProps || {};

  function getExtra(
    type?: BANK_DIALOG_TYPE,
    onBack?: React.MouseEventHandler
  ): React.ReactNode {
    switch (type) {
      case BANK_DIALOG_TYPE.NEW_BANK_TX_DEPOSIT:
      case BANK_DIALOG_TYPE.NEW_BANK_TX_WITHDRAWAL:
        return <Button onClick={onBack}>Back to Txs</Button>;
    }
    return null;
  }
  return (
    <div>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <TableContainer>
        <Table<IBank>
          {...deepTableProps}
          columns={getBankTableColumns((dataIndex) => (value, record) => {
            if (dataIndex === "action") {
              return (
                <Space>
                  <Tooltip title={`Add fund to bank ${record.bank}`}>
                    <Button
                      size="small"
                      onClick={() =>
                        onFundEdit?.(record, BankTxType.DEPOSIT)
                      }
                    >
                      <PlusOutlined size={10} />
                    </Button>
                  </Tooltip>
                  <Tooltip title={`Deduct fund to bank ${record.bank}`}>
                    <Button
                      size="small"
                      onClick={() =>
                        onFundEdit?.(record, BankTxType.WITHDRAWAL)
                      }
                    >
                      <MinusOutlined size={10} />
                    </Button>
                  </Tooltip>
                </Space>
              );
            }
            return value;
          })}
        />
      </TableContainer>
      <Drawer {...deepDrawerProps} extra={getExtra(drawerType, onBack)}>
        {drawerType === BANK_DIALOG_TYPE.NEW_BANK && (
          <NewBank {...newBankProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.FUND_CHANGE && (
          <BankFundChange {...fundChangeProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.VIEW_BANK && (
          <BankView {...deepBankTxProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.NEW_BANK_TX_DEPOSIT && (
          <NewBankDepositTx {...newBankTxProps?.depositProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.NEW_BANK_TX_WITHDRAWAL && (
          <NewBankWithdrawalTx {...newBankTxProps?.withdrawalProps} />
        )}
      </Drawer>
    </div>
  );
}
