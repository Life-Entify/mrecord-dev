import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreatePayrollAction,
  graphDeletePayrollAction,
  graphGetPayrollActions,
  graphUpdatePayrollAction,
} from "app/graph.queries/payroll_actions";
import React from "react";
import { IPayrollAction } from "ui";
interface IReturnedData {
  payroll_action: (keyof IPayrollAction)[];
}
export interface IQPayrollActionInput {
  payroll_action: Partial<IPayrollAction>;
}
export interface IQPayrollActionRes {
  payroll_action: IPayrollAction;
}
const defaultValue: IReturnedData = {
  payroll_action: [
    "_id",
    "action_kind",
    "action_type",
    "active",
    "amount",
    "count",
    "description",
    "employee_ids",
    "is_constant",
    "is_general",
    "name",
    "repeats",
  ],
};
export function usePayrollAction(
  graphReturnedData: IReturnedData = defaultValue
) {
  const [createPayrollAction] = useMutation<
    IQPayrollActionRes,
    IQPayrollActionInput
  >(graphCreatePayrollAction(graphReturnedData.payroll_action));
  const [getPayrollActions] = useLazyQuery<
    { payroll_actions: IPayrollAction[] },
    { keyword: Partial<IPayrollAction> }
  >(graphGetPayrollActions(graphReturnedData.payroll_action), {
    fetchPolicy: "network-only",
  });
  const [updatePayrollAction] = useMutation<
    IQPayrollActionRes,
    { _id: string; payroll_action: Partial<IPayrollAction> }
  >(graphUpdatePayrollAction(graphReturnedData.payroll_action));
  const [deletePayrollAction] = useMutation<{ _id: string }, { _id: string }>(
    graphDeletePayrollAction()
  );

  return {
    createPayrollAction,
    getPayrollActions,
    updatePayrollAction,
    deletePayrollAction,
  };
}
