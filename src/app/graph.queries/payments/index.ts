import { gql } from "@apollo/client";
import { IPayment } from "ui";

export const graphDeletePayment = () => {
  return gql`
    mutation deletePayment($_id: String) {
      _id: deletePayment(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdatePayment = (payment?: (keyof IPayment)[]) => {
  const query = payment ? payment.join(" ") : "_id";
  return gql`
    mutation updatePayment($_id: String, $payment: PaymentInputType, $transactions: [TransactionInputType]) {
        payment : updatePayment(_id: $_id, payment: $payment, transactions: $transactions) {
            ${query}
        }
    }`;
};
export const graphCreatePayment = (payment?: (keyof IPayment)[]) => {
  const query = payment ? payment.join(" ") : "_id";
  return gql`
    mutation createPayment($payment : PaymentInputType, $transactions: [TransactionInputType]) {
      payment : createPayment(payment : $payment, transactions: $transactions) {
            ${query}
        }
    }`;
};
export const graphGetPayments = (payment?: (keyof IPayment)[]) => {
  const query = payment ? payment.join(" ") : "_id";
  return gql`
    query getPayments($keyword: PaymentInputType, $limit: Int, $skip: Int) {
      payments: getPayments(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
