import {
  Button,
  ButtonProps,
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
import { IBank } from "../types";
import { getBankTableColumns } from "./data";
import { INewBankProps, NewBank } from "./NewBank";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { BankFundChange, IBankFundChangeProps } from "./FundChange";
import { BankView, IBankViewProps } from "./BankView";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum BANK_DIALOG_TYPE {
  FUND_CHANGE = 1,
  NEW_BANK = 2,
  VIEW_BANK = 3,
}
export enum BANK_EDIT_ACTIONS {
  DEDUCT = "deduct",
  ADD = "add",
}
export interface IBanksProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & { drawerType?: BANK_DIALOG_TYPE };
  newBankProps?: INewBankProps;
  tableProps?: Omit<TableProps<IBank>, "columns"> & {
    onFundEdit?: (record: IBank, action: BANK_EDIT_ACTIONS) => void;
  };
  fundChangeProps?: IBankFundChangeProps;
  bankViewProps?: IBankViewProps;
}

export function Banks({
  drawerProps,
  toolbarProps,
  newBankProps,
  tableProps,
  fundChangeProps,
  bankViewProps,
}: IBanksProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { extra, ...deepToolbarProps } = toolbarProps || {};
  const { onFundEdit, ...deepTableProps } = tableProps || {};
  return (
    <div>
      {toolbarProps && <Toolbar {...deepToolbarProps} />}
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
                        onFundEdit?.(record, BANK_EDIT_ACTIONS.ADD)
                      }
                    >
                      <PlusOutlined size={10} />
                    </Button>
                  </Tooltip>
                  <Tooltip title={`Deduct fund to bank ${record.bank}`}>
                    <Button
                      size="small"
                      onClick={() =>
                        onFundEdit?.(record, BANK_EDIT_ACTIONS.DEDUCT)
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
      <Drawer {...deepDrawerProps}>
        {drawerType === BANK_DIALOG_TYPE.NEW_BANK && (
          <NewBank {...newBankProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.FUND_CHANGE && (
          <BankFundChange {...fundChangeProps} />
        )}
        {drawerType === BANK_DIALOG_TYPE.VIEW_BANK && (
          <BankView {...bankViewProps} />
        )}
      </Drawer>
    </div>
  );
}
