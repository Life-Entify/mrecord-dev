import { useBankTx } from "app/graph.hooks/bankTx";
import { useEmployee } from "app/graph.hooks/employee";
import { usePayment } from "app/graph.hooks/payment";
import { selectUser } from "app/redux/user.core";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { BankTxType, IBankTx, INotify, IOrgBank } from "ui";

export function useBankTxAction() {
  const { getBankTxs, createBankTx, updateBankTx, deleteBankTx } = useBankTx();
  const { getEmployeesByEmployeeId } = useEmployee();
  const { getPayments } = usePayment();
  const user = useSelector(selectUser);
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
      const { data: paymentData } = await getPayments({
        variables: {
          keyword: { bank_id: bank._id },
        },
      });
      const { payments } = paymentData || {};
      if (payments) {
        for (let i = 0; i < payments.length; i++) {
          const payment = payments[i];
          bank_txs?.push({
            description: payment.description,
            payment_id: payment._id,
            _id: payment._id,
            tx_type:
              payment.tx_type === "income"
                ? BankTxType.DEPOSIT
                : BankTxType.WITHDRAWAL,
            employee_id: payment.employee_id,
            bank_id: payment.bank_id as string,
            amount: payment.total_amount,
            payment_type: payment.pay_type,
            created_at: payment.created_at,
          });
        }
      }
      const empIds: number[] = [];
      bank_txs?.forEach((bankTx) => empIds.push(bankTx.employee_id));
      if (empIds.length > 0) {
        const { data: empData } = await getEmployeesByEmployeeId({
          variables: {
            ids: empIds,
          },
        });
        const { employees } = empData || {};
        bank_txs?.forEach((tx, index) => {
          const emp = employees?.find(
            (item) => item.employee_id === tx.employee_id
          );
          if (emp) {
            bank_txs[index].employee = emp;
          }
        });
      }
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
    async (
      bank: IOrgBank,
      bnkTx: Partial<IBankTx>,
      options?: { notify?: INotify }
    ) => {
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
        await getBnkTxs(bank, { notify: options?.notify });
        options?.notify?.("success", {
          key: "update-bnkTx-success",
          message: "Success",
          description: "Bank transaction updated",
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
      try {
        bankTx.employee_id = user.employee_id;
        bankTx.bank_id = bank._id;
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
    [!!createBankTx, JSON.stringify(user)]
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
