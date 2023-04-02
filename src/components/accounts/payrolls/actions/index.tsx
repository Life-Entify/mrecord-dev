import { usePayrollAction } from "app/graph.hooks/payroll_action";
import React, { useCallback, useEffect, useState } from "react";
import { IPayrollAction, INotify, PAYROLL_ACTION_TYPES } from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
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
  const [payrollActions, setPayrollActions] = useState<{
    deductions?: IPayrollAction[];
    bonuses?: IPayrollAction[];
  }>();
  const [payrollAction, setPayrollAction] = useState<IPayrollAction>();
  const getPrActions = async (
    noise?: boolean,
    options?: { notify?: INotify }
  ) => {
    getDeductions(noise, options);
    setTimeout(() => {
      getBonuses(noise, options);
    }, 2000);
  };
  const serializeType = (value: any): IPayrollAction => {
    return {
      ...value,
      is_general: value.is_general === "true" ? true : false,
      is_constant: value.is_constant === "true" ? true : false,
      active: value.active === BOOLEAN_STRING.yes ? true : false,
    };
  };
  const getDeductions = async (
    noise?: boolean,
    options?: { notify?: INotify }
  ) => {
    try {
      const { data } = await getPayrollActions({
        variables: {
          keyword: { action_type: "deduction" },
        },
        context: {
          id: "getDeductions",
        },
      });
      const { payroll_actions } = data || {};
      setPayrollActions((state) => ({
        ...state,
        deductions: payroll_actions?.map((item) => serializeType(item)),
      }));
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
  const getBonuses = async (
    noise?: boolean,
    options?: { notify?: INotify }
  ) => {
    try {
      const { data } = await getPayrollActions({
        variables: {
          keyword: { action_type: "bonus" },
        },
        context: {
          id: "getBonuses",
        },
      });
      const { payroll_actions } = data || {};
      setPayrollActions((state) => ({
        ...state,
        bonuses: payroll_actions?.map((item) => serializeType(item)),
      }));
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
    async (
      payrollActionId: string,
      actionType: keyof typeof PAYROLL_ACTION_TYPES,
      options?: IActionOptions
    ) => {
      try {
        await deletePayrollAction({
          variables: { _id: payrollActionId },
        });
        if (actionType === "bonus") {
          await getBonuses();
        } else await getDeductions();
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
    async (
      prAction: Partial<IPayrollAction>,
      options?: IActionOptions & { _id?: string }
    ) => {
      if (Object.keys(prAction).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      if (prAction.active === true) {
        //@ts-ignore
        prAction.active = BOOLEAN_STRING.yes;
      } else if (prAction.active === false) {
        //@ts-ignore
        prAction.active = BOOLEAN_STRING.no;
      }
      try {
        const _id = (payrollAction?._id || options?._id) as string;
        await updatePayrollAction({
          variables: {
            payroll_action: prAction,
            _id,
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
    createPayrollAction: createPrAction,
    updatePayrollAction: updatePrAction,
    deletePayrollAction: deletePrAction,
  };
}
