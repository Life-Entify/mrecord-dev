import { Divider, FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { BankTxType, IOrgBank } from "../types";
import { bankLabelMap } from "./data";
import { INewBankDepositTxProps, NewBankDepositTx } from "./NewBankTx";
import {
  INewBankWithdrawalTxProps,
  NewBankWithdrawalTx,
} from "./NewBankTx/Withdrawal";

const Root = styled.div``;

export interface IBankFundChangeProps {
  bank?: IOrgBank;
  bankAction?: BankTxType;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IOrgBank>,
    "data" | "dataMap" | "skipMap"
  >;
  newDepositTxProps?: INewBankDepositTxProps;
  newWithdrawalTxProps?: INewBankWithdrawalTxProps;
}

export function BankFundChange({
  bank,
  bankAction,
  infoBoardProps,
  newDepositTxProps,
  newWithdrawalTxProps,
}: IBankFundChangeProps) {
  return (
    <Root>
      <InfoBoard<keyof IOrgBank>
        {...infoBoardProps}
        title={bank?.bank}
        data={bank}
        dataMap={bankLabelMap}
        skipMap={["_id"]}
      />
      <Divider style={{ marginTop: 50 }} />

      {bankAction === BankTxType.DEPOSIT ? (
        <NewBankDepositTx {...newDepositTxProps} />
      ) : (
        <NewBankWithdrawalTx {...newWithdrawalTxProps} />
      )}
    </Root>
  );
}
