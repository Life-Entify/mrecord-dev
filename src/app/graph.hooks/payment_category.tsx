import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreatePaymentCategory,
  graphDeletePaymentCategory,
  graphGetPaymentCategories,
  graphUpdatePaymentCategory,
} from "app/graph.queries/payment_category";
import React from "react";
import { IPaymentCategory } from "ui";
interface IReturnedData {
  paymentCategory: (keyof IPaymentCategory)[];
}
export interface IQPaymentCategoryInput {
  payment_category: Partial<IPaymentCategory>;
}
export interface IQPaymentCategoryRes {
  paymentCategory: IPaymentCategory;
}
const defaultValue: IReturnedData = {
  paymentCategory: ["_id", "type", "description", "title"],
};
export function usePaymentCategory(
  graphReturnedData: IReturnedData = defaultValue
) {
  const [createPaymentCategory] = useMutation<
    IQPaymentCategoryRes,
    IQPaymentCategoryInput
  >(graphCreatePaymentCategory(graphReturnedData.paymentCategory));
  const [getPaymentCategories] = useLazyQuery<
    { paymentCategories: IPaymentCategory[] },
    { keyword: Partial<IPaymentCategory> }
  >(graphGetPaymentCategories(graphReturnedData.paymentCategory), {
    fetchPolicy: "network-only",
  });
  const [updatePaymentCategory] = useMutation<
    IQPaymentCategoryRes,
    { _id: string; payment_category: Partial<IPaymentCategory> }
  >(graphUpdatePaymentCategory(graphReturnedData.paymentCategory));
  const [deletePaymentCategory] = useMutation<{ _id: string }, { _id: string }>(
    graphDeletePaymentCategory()
  );

  return {
    createPaymentCategory,
    getPaymentCategories,
    updatePaymentCategory,
    deletePaymentCategory,
  };
}
