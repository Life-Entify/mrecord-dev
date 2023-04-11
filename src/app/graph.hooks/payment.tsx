import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreatePayment,
  graphDeletePayment,
  graphGetPayments,
  graphUpdatePayment,
} from "app/graph.queries/payments";
import React from "react";
import { IPayment, ITx } from "ui";
interface IReturnedData {
  payment: (keyof Omit<IPayment, "person" | "txs">)[];
}
export interface IQPaymentInput {
  payment: Partial<IPayment>;
}
export interface IQPaymentRes {
  payment: IPayment;
}
const defaultValue: IReturnedData = {
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
  ],
};
export function usePayment(graphReturnedData: IReturnedData = defaultValue) {
  const [createPayment] = useMutation<
    IQPaymentRes,
    { payment: IPayment; transactions: ITx[] }
  >(graphCreatePayment(graphReturnedData.payment));
  const [getPayments] = useLazyQuery<
    { payments: IPayment[] },
    { keyword?: Partial<IPayment>; limit?: number; skip?: number }
  >(graphGetPayments(graphReturnedData.payment), {
    fetchPolicy: "network-only",
  });
  const [updatePayment] = useMutation<
    IQPaymentRes,
    { _id: string; payment: Partial<Omit<IPayment, "_id">> }
  >(graphUpdatePayment(graphReturnedData.payment));
  const [deletePayment] = useMutation<{ _id: string }, { _id: string }>(
    graphDeletePayment()
  );

  return {
    createPayment,
    getPayments,
    updatePayment,
    deletePayment,
  };
}
