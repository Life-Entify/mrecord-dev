import { usePayrollAction } from "app/graph.hooks/payroll_action";
import React, { useCallback, useEffect, useState } from "react";
import { IPayrollAction, INotify } from "ui";
export interface IActionOptions {
  notify: INotify;
}
export function usePayrollActionAction() {
  const {
    getPayrollActions,
    createPayrollAction,
    updatePayrollAction,
    deletePayrollAction,
  } = usePayrollAction();
  const [payrollActions, setPayrollActions] = useState<IPayrollAction[]>();
  const [payrollAction, setPayrollAction] = useState<IPayrollAction>();
  const getPrActions = async (
    noise?: boolean,
    options?: { notify?: INotify }
  ) => {
    try {
      const { data } = await getPayrollActions({});
      const { payroll_actions } = data || {};
      setPayrollActions(payroll_actions);
      noise &&
        options?.notify?.("success", {
          key: "get-payroll-action-success",
          message: "Success",
          description: "Fetched payroll actionss",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-payroll-action-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deletePrAction = useCallback(
    async (payrollActionId?: string, options?: IActionOptions) => {
      if (!payrollActionId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No PayrollAction ID found!",
        });
      }
      try {
        await deletePayrollAction({
          variables: { _id: payrollActionId },
        });
        await getPrActions(false, options);
        options?.notify?.("success", {
          key: "delete-payroll-action-success",
          message: "Success",
          description: "PayrollAction deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updatePayrollAction, JSON.stringify(payrollAction)]
  );
  const updatePrAction = useCallback(
    async (prAction: Partial<IPayrollAction>, options?: IActionOptions) => {
      if (Object.keys(prAction).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updatePayrollAction({
          variables: {
            payroll_action: prAction,
            _id: payrollAction?._id as string,
          },
        });
        await getPrActions(false, { notify: options?.notify });
        options?.notify?.("success", {
          key: "update-payroll-action-success",
          message: "Success",
          description: "PayrollAction updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updatePayrollAction, JSON.stringify(payrollAction)]
  );
  const createPrAction = useCallback(
    async (payrollAction: Partial<IPayrollAction>, options: IActionOptions) => {
      try {
        await createPayrollAction({
          variables: { payroll_action: payrollAction },
        });
        await getPrActions(false, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-payroll-action-success",
          message: "Success",
          description: "PayrollAction created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-payroll-action-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createPayrollAction]
  );
  useEffect(() => {
    getPrActions();
  }, []);

  return {
    payrollActions,
    payrollAction,
    setPayrollAction,
    getPayrollActions: getPrActions,
    createPayrollAction: createPrAction,
    updatePayrollAction: updatePrAction,
    deletePayrollAction: deletePrAction,
  };
}
