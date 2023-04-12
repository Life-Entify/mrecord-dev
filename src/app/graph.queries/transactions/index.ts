import { gql } from "@apollo/client";
import { IPayment, ITx } from "ui";

export const graphDeleteTransaction = (payment?: (keyof IPayment)[]) => {
  const query = payment ? payment?.join(" ") : "_id";
  return gql`
    mutation deleteTransaction($_id: String, $payment_id: String) {
      payment: deleteTransaction(_id: $_id, payment_id: $payment_id) {
        ${query}
      }
    }
  `;
};
export const graphUpdateTransaction = (transaction?: (keyof ITx)[]) => {
  const query = transaction ? transaction.join(" ") : "_id";
  return gql`
    mutation updateTransaction($_id: String, $transaction: TransactionInputType) {
        transaction : updateTransaction(_id: $_id, transaction: $transaction) {
            ${query}
        }
    }`;
};
export const graphCreateTransaction = (transaction?: (keyof ITx)[]) => {
  const query = transaction ? transaction.join(" ") : "_id";
  return gql`
    mutation createTransaction($transaction : TransactionInputType) {
      transaction : createTransaction(transaction : $transaction) {
            ${query}
        }
    }`;
};
export const graphGetTransactions = (transaction?: (keyof ITx)[]) => {
  const query = transaction ? transaction.join(" ") : "_id";
  return gql`
    query getTransactions($keyword: TransactionInputType, $limit: Int, $skip: Int) {
      transactions: getTransactions(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
export const graphGetTransactionsById = (transaction?: (keyof ITx)[]) => {
  const query = transaction ? transaction.join(" ") : "_id";
  return gql`
    query getTransactionsById($_ids: [String]) {
      transactions: getTransactionsById(_ids: $_ids) {
        ${query}
      }
    }
  `;
};
