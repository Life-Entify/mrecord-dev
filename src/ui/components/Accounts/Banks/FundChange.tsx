import { Divider } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { BankTxType, IOrgBank } from "../types";
import { bankLabelMap } from "./data";
import { INewBankTxProps, NewBankTx } from "./NewBankTx";

const Root = styled.div``;

export interface IBankFundChangeProps extends INewBankTxProps {
  bank?: IOrgBank;
  bankTxType?: BankTxType;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IOrgBank>,
    "data" | "dataMap" | "skipMap"
  >;
}

export function BankFundChange({
  bank,
  bankTx,
  bankTxType,
  infoBoardProps,
  ...deepNewBankTxProps
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
      <NewBankTx
        isEdit={Boolean(bankTx)}
        bankTx={bankTx}
        title={bankTxType === BankTxType.DEPOSIT ? "Deposit" : "Withdrawal"}
        {...deepNewBankTxProps}
      />
    </Root>
  );
}
