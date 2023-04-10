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
    mutation updatePaymentCategory($_id: String, $payment_category: PaymentCategoryInputType) {
        paymentCategory : updatePaymentCategory(_id: $_id, payment_category: $payment_category) {
            ${query}
        }
    }`;
};
export const graphCreatePaymentCategory = (
  paymentCategory?: (keyof IPaymentCategory)[]
) => {
  const query = paymentCategory ? paymentCategory.join(" ") : "_id";
  return gql`
    mutation createPaymentCategory($payment_category : PaymentCategoryInputType) {
      paymentCategory : createPaymentCategory(payment_category : $payment_category) {
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
