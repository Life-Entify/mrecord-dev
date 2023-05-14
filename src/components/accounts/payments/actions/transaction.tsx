import { useTransaction } from "app/graph.hooks/transaction";
import { useAppDispatch } from "app/redux/hook";
import React, { useCallback, useEffect, useState } from "react";
import { ITx, INotify } from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
export interface IActionOptions {
  notify: INotify;
}
export function useTransactionAction() {
  const {
    getTransactions,
    getTransactionsById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransaction();
  const [txIds, setTxIds] = useState<string[]>();
  const [transaction, setTransaction] = useState<ITx>();
  const [transactions, setTransactions] = useState<ITx[]>();
  const [allTxs, setAllTxs] = useState<ITx[]>();
  const getTxs = async (filter: Partial<ITx>, options?: { notify: INotify, noise?: boolean }) => {
    try {
      const { data } = await getTransactions({
        variables: {
          keyword: filter
        }
      });
      const { transactions } = data || {};
      setAllTxs(transactions as ITx[]);
      options?.noise &&
        options?.notify?.("success", {
          key: "get-tx-success",
          message: "Success",
          description: "Fetched transactions",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-tx-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const getTxsById = async (
    _ids: string[],
    options?: { notify: INotify; noise?: boolean }
  ) => {
    try {
      setTxIds(_ids);
      const { data } = await getTransactionsById({
        variables: {
          _ids,
        },
      });
      const { transactions } = data || {};
      setTransactions(transactions as ITx[]);
      options?.noise &&
        options?.notify?.("success", {
          key: "get-tx-success",
          message: "Success",
          description: "Fetched transactions",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-tx-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deleteTx = useCallback(
    async (txId: string, paymentId: string, options?: IActionOptions) => {
      try {
        await deleteTransaction({
          variables: { _id: txId, payment_id: paymentId },
        });
        const newTxIds = txIds?.splice(txIds.indexOf(txId), 1);
        if (newTxIds && newTxIds.length > 0) {
          await getTxsById(newTxIds, options);
        }
        options?.notify?.("success", {
          key: "delete-tx-success",
          message: "Success",
          description: "Transaction deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateTransaction, JSON.stringify(txIds)]
  );
  const updateTx = useCallback(
    async (tx: Partial<ITx>, options?: IActionOptions) => {
      if (Object.keys(tx).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updateTransaction({
          variables: { transaction: tx, _id: transaction?._id as string },
        });
        if (data?.transaction) setTransaction(data.transaction);
        options?.notify?.("success", {
          key: "update-tx-success",
          message: "Success",
          description: "Transaction updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateTransaction, JSON.stringify(transaction)]
  );
  const createTx = useCallback(
    async (transaction: Partial<ITx>, options: IActionOptions) => {
      try {
        await createTransaction({
          variables: { transaction },
        });
        await getTxs({}, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-tx-success",
          message: "Success",
          description: "Transaction created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-tx-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createTransaction]
  );
  return {
    transactions,
    transaction,
    setTransaction,
    setTransactions,
    getTransactions: getTxs,
    getTransactionsById: getTxsById,
    createTransaction: createTx,
    updateTransaction: updateTx,
    deleteTransaction: deleteTx,
  };
}
