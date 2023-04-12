import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreateBankTx,
  graphDeleteBankTx,
  graphGetBankTxs,
  graphUpdateBankTx,
} from "app/graph.queries/bankTxs";
import React from "react";
import { IBankTx } from "ui";
interface IReturnedData {
  bank_tx: (keyof IBankTx)[];
}
export interface IQBankTxInput {
  bank_tx: Partial<IBankTx>;
}
export interface IQBankTxRes {
  bank_tx: IBankTx;
}
const defaultValue: IReturnedData = {
  bank_tx: [
    "_id",
    "amount",
    "payment_type",
    // "bank",
    "bank_id",
    "created_at",
    "description",
    "employee_id",
    "tx_type",
    "payment_id",
  ],
};
export function useBankTx(graphReturnedData: IReturnedData = defaultValue) {
  const [createBankTx] = useMutation<IQBankTxRes, IQBankTxInput>(
    graphCreateBankTx(graphReturnedData.bank_tx)
  );
  const [getBankTxs] = useLazyQuery<
    { bank_txs: IBankTx[] },
    { keyword: Partial<IBankTx> }
  >(graphGetBankTxs(graphReturnedData.bank_tx), {
    fetchPolicy: "network-only",
  });
  const [updateBankTx] = useMutation<
    IQBankTxRes,
    { _id: string; bank_tx: Partial<IBankTx> }
  >(graphUpdateBankTx(graphReturnedData.bank_tx));
  const [deleteBankTx] = useMutation<{ _id: string }, { _id: string }>(
    graphDeleteBankTx()
  );

  return {
    createBankTx,
    getBankTxs,
    updateBankTx,
    deleteBankTx,
  };
}
