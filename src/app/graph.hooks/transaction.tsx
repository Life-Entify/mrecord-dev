import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreateTransaction,
  graphDeleteTransaction,
  graphGetTransactions,
  graphGetTransactionsById,
  graphUpdateTransaction,
} from "app/graph.queries/transactions";
import React from "react";
import { ITx } from "ui";
interface IReturnedData {
  transaction: (keyof ITx)[];
}
export interface IQTransactionInput {
  transaction: Partial<ITx>;
}
export interface IQTransactionRes {
  transaction: ITx;
}
const defaultValue: IReturnedData = {
  transaction: [
    "_id",
    "amount",
    "category_id",
    "created_at",
    "payment_id",
    "remark",
    "tx_type",
  ],
};
export function useTransaction(
  graphReturnedData: IReturnedData = defaultValue
) {
  const [createTransaction] = useMutation<IQTransactionRes, IQTransactionInput>(
    graphCreateTransaction(graphReturnedData.transaction)
  );
  const [getTransactionsById] = useLazyQuery<
    { transactions: ITx[] },
    { _ids: string[] }
  >(graphGetTransactionsById(graphReturnedData.transaction), {
    fetchPolicy: "network-only",
  });
  const [getTransactions] = useLazyQuery<
    { transactions: ITx[] },
    { keyword: Partial<ITx> }
  >(graphGetTransactions(graphReturnedData.transaction), {
    fetchPolicy: "network-only",
  });
  const [updateTransaction] = useMutation<
    IQTransactionRes,
    { _id: string; transaction: Partial<ITx> }
  >(graphUpdateTransaction(graphReturnedData.transaction));
  const [deleteTransaction] = useMutation<{ _id: string }, { _id: string }>(
    graphDeleteTransaction()
  );

  return {
    createTransaction,
    getTransactions,
    getTransactionsById,
    updateTransaction,
    deleteTransaction,
  };
}
