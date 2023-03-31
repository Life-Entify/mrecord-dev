import { useCheque } from "app/graph.hooks/cheque";
import React, { useCallback, useEffect, useState } from "react";
import { ICheque, INotify } from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
export interface IActionOptions {
  notify: INotify;
}
export function useChequeAction() {
  const { getCheques, createCheque, updateCheque, deleteCheque } = useCheque();
  const [cheques, setCheques] = useState<ICheque[]>();
  const [cheque, setCheque] = useState<ICheque>();
  const getChqs = async (noise?: boolean, options?: { notify?: INotify }) => {
    try {
      const { data } = await getCheques({});
      const { cheques } = data || {};
      setCheques(cheques);
      noise &&
        options?.notify?.("success", {
          key: "get-bnk-success",
          message: "Success",
          description: "Fetched cheques",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-bnk-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deleteChq = useCallback(
    async (chequeId?: string, options?: IActionOptions) => {
      if (!chequeId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No Cheque ID found!",
        });
      }
      try {
        await deleteCheque({
          variables: { _id: chequeId },
        });
        await getChqs(false, options);
        options?.notify?.("success", {
          key: "delete-bnk-success",
          message: "Success",
          description: "Cheque deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateCheque, JSON.stringify(cheque)]
  );
  const updateChq = useCallback(
    async (bnk: Partial<ICheque>, options?: IActionOptions) => {
      if (Object.keys(bnk).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updateCheque({
          variables: { cheque: bnk, _id: cheque?._id as string },
        });
        await getChqs(false, { notify: options?.notify });
        options?.notify?.("success", {
          key: "update-bnk-success",
          message: "Success",
          description: "Cheque updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateCheque, JSON.stringify(cheque)]
  );
  const createChq = useCallback(
    async (cheque: Partial<ICheque>, options: IActionOptions) => {
      if (!cheque.cheque_number) {
        return options?.notify?.("error", {
          key: "create-bnk-error",
          message: "Error",
          description: "Missing cheque number field",
        });
      }
      try {
        cheque.created_at = Date.now().toString();
        await createCheque({
          variables: { cheque },
        });
        await getChqs(false, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-bnk-success",
          message: "Success",
          description: "Cheque created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-bnk-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createCheque]
  );
  useEffect(() => {
    getChqs();
  }, []);

  return {
    cheques,
    cheque,
    setCheque,
    getCheques: getChqs,
    createCheque: createChq,
    updateCheque: updateChq,
    deleteCheque: deleteChq,
  };
}
