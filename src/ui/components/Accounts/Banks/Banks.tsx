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
import { BankTxType, IOrgBank } from "../types";
import { getBankTableColumns, orgBankInputForm } from "./data";
import { INewBankProps, NewBank } from "./NewBank";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BankFundChange, IBankFundChangeProps } from "./FundChange";
import { BankView, IBankViewProps } from "./BankView";
import { INewBankDepositTxProps, NewBankDepositTx } from "./NewBankTx";
import {
  INewBankWithdrawalTxProps,
  NewBankWithdrawalTx,
} from "./NewBankTx/Withdrawal";
import { BOOLEAN_STRING } from "ui/components/types";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum BANK_DIALOG_TYPE {
  FUND_CHANGE = 1,
  NEW_BANK = 2,
  VIEW_BANK = 3,
  EDIT_BANK = 6,
  NEW_BANK_TX_DEPOSIT = 4,
  NEW_BANK_TX_WITHDRAWAL = 5,
}
export interface IBanksProps {
  banks?: IOrgBank[];
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & {
    drawerType?: BANK_DIALOG_TYPE;
  };
  newBankProps?: Omit<INewBankProps<IOrgBank>, "inputFields">;
  tableProps?: Omit<TableProps<IOrgBank>, "columns" | "dataSource"> & {
    onFundEdit?: (record: IOrgBank, action: BankTxType) => void;
  };
  fundChangeProps?: IBankFundChangeProps;
  bankViewProps?: IBankViewProps & {
    onBack?: React.MouseEventHandler;
    onDisplayEdit?: () => void;
    onChangeBankStatus?: (active: BOOLEAN_STRING) => void;
  };
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
  bankViewProps,
  newBankTxProps,
  banks,
}: IBanksProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onFundEdit, ...deepTableProps } = tableProps || {};
  const {
    onBack,
    infoBoardProps,
    onDisplayEdit,
    onChangeBankStatus,
    bank,
    ...deepBankViewProps
  } = bankViewProps || {};

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
        <Table<IOrgBank>
          {...deepTableProps}
          dataSource={banks?.map((i) => ({ ...i, key: i._id }))}
          columns={getBankTableColumns((dataIndex) => (value, record) => {
            if (dataIndex === "action") {
              return (
                <Space>
                  <Tooltip title={`Add fund to bank ${record.bank}`}>
                    <Button
                      size="small"
                      onClick={() => onFundEdit?.(record, BankTxType.DEPOSIT)}
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
          size="small"
        />
      </TableContainer>
      <Drawer {...deepDrawerProps} extra={getExtra(drawerType, onBack)}>
        {drawerType === BANK_DIALOG_TYPE.NEW_BANK && (
          <NewBank {...newBankProps} inputFields={orgBankInputForm} />
        )}
        {drawerType === BANK_DIALOG_TYPE.EDIT_BANK && (
          <NewBank {...newBankProps} inputFields={orgBankInputForm} isEdit />
        )}
        {drawerType === BANK_DIALOG_TYPE.FUND_CHANGE && (
          <BankFundChange {...fundChangeProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.VIEW_BANK && (
          <BankView
            bank={bank}
            {...deepBankViewProps}
            infoBoardProps={{
              ...infoBoardProps,
              descriptionProps: {
                extra: (
                  <Space>
                    <Button
                      size="small"
                      onClick={() =>
                        onChangeBankStatus?.(
                          bank?.active === BOOLEAN_STRING.yes
                            ? BOOLEAN_STRING.no
                            : BOOLEAN_STRING.yes
                        )
                      }
                    >
                      {bank?.active === BOOLEAN_STRING.yes
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                    <Button size="small" onClick={() => onDisplayEdit?.()}>
                      Edit
                    </Button>
                  </Space>
                ),
              },
            }}
          />
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
