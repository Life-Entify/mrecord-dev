import { useBankTx } from "app/graph.hooks/bankTx";
import React, { useCallback, useState } from "react";
import { IBankTx, INotify, IOrgBank } from "ui";

export function useBankTxAction() {
  const { getBankTxs, createBankTx, updateBankTx, deleteBankTx } = useBankTx();
  const [bankTx, setBankTx] = useState<IBankTx>();
  const [bankTxs, setBankTxs] = useState<IBankTx[]>();
  const getBnkTxs = async (
    bank: IOrgBank,
    options?: { notify?: INotify; noise?: boolean }
  ) => {
    try {
      const { data } = await getBankTxs({
        variables: {
          keyword: { bank_id: bank._id },
        },
      });
      const { bank_txs } = data || {};
      setBankTxs(bank_txs);
      options?.noise &&
        options?.notify?.("success", {
          key: "get-bnkTx-success",
          message: "Success",
          description: "Fetched bankTxs",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-bnkTx-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deleteBnkTx = useCallback(
    async (
      bank: IOrgBank,
      bankTxId?: string,
      options?: { notify?: INotify }
    ) => {
      if (!bankTxId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No BankTx ID found!",
        });
      }
      try {
        await deleteBankTx({
          variables: { _id: bankTxId },
        });
        await getBnkTxs(bank, { notify: options?.notify });
        options?.notify?.("success", {
          key: "delete-bnkTx-success",
          message: "Success",
          description: "BankTx deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateBankTx, JSON.stringify(bankTx)]
  );
  const updateBnkTx = useCallback(
    async (bnkTx: Partial<IBankTx>, options?: { notify?: INotify }) => {
      if (Object.keys(bnkTx).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updateBankTx({
          variables: { bank_tx: bnkTx, _id: bankTx?._id as string },
        });
        if (data?.bank_tx) setBankTx(data.bank_tx);
        options?.notify?.("success", {
          key: "update-bnkTx-success",
          message: "Success",
          description: "BankTx updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateBankTx, JSON.stringify(bankTx)]
  );
  const createBnkTx = useCallback(
    async (
      bank: IOrgBank,
      bankTx: Partial<IBankTx>,
      options: { notify?: INotify }
    ) => {
      if (!bankTx) {
        return options?.notify?.("error", {
          key: "create-bnkTx-error",
          message: "Error",
          description: "Missing name field",
        });
      }
      console.log(bankTx);
      try {
        await createBankTx({
          variables: { bank_tx: bankTx },
        });
        await getBnkTxs(bank, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-bnkTx-success",
          message: "Success",
          description: "BankTx created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-bnkTx-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createBankTx]
  );
  return {
    bankTxs,
    bankTx,
    setBankTx,
    getBankTxs: getBnkTxs,
    createBankTx: createBnkTx,
    updateBankTx: updateBnkTx,
    deleteBankTx: deleteBnkTx,
  };
}
