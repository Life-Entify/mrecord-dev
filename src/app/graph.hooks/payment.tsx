import { useLazyQuery, useMutation } from "@apollo/client";
import {
  IPaymentReturnObjects,
  graphCreatePayment,
  graphDeletePayment,
  graphGetPaymentSummaryByEmps,
  graphGetPayments,
  graphUpdatePayment,
} from "app/graph.queries/payments";
import React from "react";
import { IDateFilter, IPayment, IPaymentSummaryEmp, ITx } from "ui";
interface IReturnedData extends IPaymentReturnObjects {
  payment: (keyof Omit<IPayment, "person" | "txs">)[];
  paymentSummary: (keyof IPaymentSummaryEmp)[];
}
const defaultValue: IReturnedData = {
  paymentSummary: ["employee", "action_types", "pay_types"],
  employee: ["_id", "employee_id", "person", "person_id"],
  person: ["profile"],
  profile: ["last_name", "first_name"],
  action_types: ["action_type", "total_amount"],
  pay_types: ["pay_type", "tx_type", "total_amount"],
  payment: [
    "_id",
    "bank_id",
    "action_type",
    "created_at",
    "description",
    "employee_id",
    "pay_type",
    "person_id",
    "total_amount",
    "tx_ids",
    "tx_type",
    "unresolved",
    "client",
    "cheque_id",
  ],
};
export function usePayment(graphReturnedData: IReturnedData = defaultValue) {
  const [createPayment] = useMutation<
    { payment: IPayment },
    { payment: IPayment; transactions: ITx[] }
  >(graphCreatePayment(graphReturnedData.payment));
  const [getPaymentSummaryByEmp] = useLazyQuery<
    { paymentSummaryEmp: IPaymentSummaryEmp[] },
    { filter?: Partial<IPayment>; date_filter?: IDateFilter }
  >(
    graphGetPaymentSummaryByEmps(
      graphReturnedData.paymentSummary,
      graphReturnedData
    ),
    {
      fetchPolicy: "network-only",
    }
  );
  const [getPayments] = useLazyQuery<
    { payments: IPayment[] },
    { keyword?: Partial<IPayment>; limit?: number; skip?: number }
  >(graphGetPayments(graphReturnedData.payment), {
    fetchPolicy: "network-only",
  });
  const [updatePayment] = useMutation<
    { payment: IPayment },
    {
      _id: string;
      payment: Partial<Omit<IPayment, "_id">>;
      transactions?: ITx[];
    }
  >(graphUpdatePayment(graphReturnedData.payment));
  const [deletePayment] = useMutation<{ _id: string }, { _id: string }>(
    graphDeletePayment()
  );

  return {
    getPaymentSummaryByEmp,
    createPayment,
    getPayments,
    updatePayment,
    deletePayment,
  };
}
