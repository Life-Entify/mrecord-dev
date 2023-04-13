import { useBank } from "app/graph.hooks/bank";
import { selectBank, setBanks } from "app/redux/bank.core";
import { useAppDispatch } from "app/redux/hook";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppError, IOrgBank, INotify } from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
export interface IActionOptions {
  notify: INotify;
}
export function useBankAction() {
  const { getBanks, createBank, updateBank, deleteBank } = useBank();
  const banks = useSelector(selectBank);
  const dispatch = useAppDispatch();
  const [bank, setBank] = useState<IOrgBank>();
  const getBnks = async (noise?: boolean, options?: { notify: INotify }) => {
    try {
      const { data } = await getBanks({
        variables: {
          keyword: { is_admin: BOOLEAN_STRING.yes },
        },
      });
      const { banks } = data || {};
      dispatch(setBanks(banks as IOrgBank[]));
      noise &&
        options?.notify?.("success", {
          key: "get-bnk-success",
          message: "Success",
          description: "Fetched banks",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-bnk-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deleteBnk = useCallback(
    async (deptId?: string, options?: IActionOptions) => {
      if (!deptId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No Bank ID found!",
        });
      }
      try {
        await deleteBank({
          variables: { _id: deptId },
        });
        await getBnks(false, options);
        options?.notify?.("success", {
          key: "delete-bnk-success",
          message: "Success",
          description: "Bank deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateBank, JSON.stringify(bank)]
  );
  const updateBnk = useCallback(
    async (bnk: Partial<IOrgBank>, options?: IActionOptions) => {
      if (Object.keys(bnk).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updateBank({
          variables: { bank: bnk, _id: bank?._id as string },
        });
        if (data?.bank) setBank(data.bank);
        options?.notify?.("success", {
          key: "update-bnk-success",
          message: "Success",
          description: "Bank updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateBank, JSON.stringify(bank)]
  );
  const createBnk = useCallback(
    async (bank: Partial<IOrgBank>, options: IActionOptions) => {
      if (!bank.name) {
        return options?.notify?.("error", {
          key: "create-bnk-error",
          message: "Error",
          description: "Missing name field",
        });
      }
      try {
        await createBank({
          variables: { bank },
        });
        await getBnks(false, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-bnk-success",
          message: "Success",
          description: "Bank created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-bnk-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createBank]
  );
  useEffect(() => {
    getBnks();
  }, []);

  return {
    banks,
    activeBanks:
      banks?.map((bank) => {
        if (bank.active === BOOLEAN_STRING.yes) {
          return bank;
        }
      }) || [],
    bank,
    setBank,
    getBanks: getBnks,
    createBank: createBnk,
    updateBank: updateBnk,
    deleteBank: deleteBnk,
  };
}
