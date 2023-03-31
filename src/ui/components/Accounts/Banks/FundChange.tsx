import { Divider, FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { IInfoBoardProps, InfoBoard } from "ui/common";
import { BankTxType, IBankTx, IOrgBank } from "../types";
import { bankLabelMap } from "./data";
import { IBankTxMoment, NewBankTx } from "./NewBankTx";

const Root = styled.div``;

export interface IBankFundChangeProps {
  banks?: IOrgBank[];
  bank?: IOrgBank;
  bankTx?: IBankTxMoment;
  bankTxType?: BankTxType;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IOrgBank>,
    "data" | "dataMap" | "skipMap"
  >;
  onCreateBankTx?: (
    bankTx: IBankTx,
    formRef: React.RefObject<FormInstance<IBankTxMoment>>
  ) => void;
}

export function BankFundChange({
  banks,
  bank,
  bankTx,
  bankTxType,
  infoBoardProps,
  onCreateBankTx,
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
        banks={banks}
        bankTx={bankTx}
        title={bankTxType === BankTxType.DEPOSIT ? "Deposit" : "Withdrawal"}
        onCreateItem={onCreateBankTx}
      />
    </Root>
  );
}
