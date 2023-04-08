import { gql } from "@apollo/client";
import { IPaymentCategory } from "ui";

export const graphDeletePaymentCategory = () => {
  return gql`
    mutation deletePaymentCategory($_id: String) {
      _id: deletePaymentCategory(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdatePaymentCategory = (
  paymentCategory?: (keyof IPaymentCategory)[]
) => {
  const query = paymentCategory ? paymentCategory.join(" ") : "_id";
  return gql`
    mutation updatePaymentCategory($_id: String, $paymentCategory: PaymentCategoryInputType) {
        paymentCategory : updatePaymentCategory(_id: $_id, paymentCategory: $paymentCategory) {
            ${query}
        }
    }`;
};
export const graphCreatePaymentCategory = (
  paymentCategory?: (keyof IPaymentCategory)[]
) => {
  const query = paymentCategory ? paymentCategory.join(" ") : "_id";
  return gql`
    mutation createPaymentCategory($paymentCategory : PaymentCategoryInputType) {
      paymentCategory : createPaymentCategory(paymentCategory : $paymentCategory) {
            ${query}
        }
    }`;
};
export const graphGetPaymentCategories = (
  paymentCategory?: (keyof IPaymentCategory)[]
) => {
  const query = paymentCategory ? paymentCategory.join(" ") : "_id";
  return gql`
    query getPaymentCategories($keyword: PaymentCategoryInputType, $limit: Int, $skip: Int) {
      paymentCategories: getPaymentCategories(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
