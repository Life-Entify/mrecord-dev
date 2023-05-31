import { gql } from "@apollo/client";
import { queryStringBuilder } from "app/utils";
import {
  IPayment,
  IPaymentSummaryEmp,
  IPayTypeAccount,
  IActionTypeAccount,
  IEmployee,
  IPerson,
  IProfile,
} from "ui";

export interface IPaymentReturnObjects {
  employee?: (keyof IEmployee)[];
  person?: (keyof IPerson)[];
  profile?: (keyof IProfile)[];
  action_types?: (keyof IActionTypeAccount)[];
  pay_types?: (keyof IPayTypeAccount)[];
}
export const graphGetPaymentSummaryByEmps = <
  Q = IPaymentSummaryEmp,
  N = IPaymentReturnObjects
>(
  payment?: (keyof Q)[] | (keyof N)[],
  nestedValues?: N
) => {
  const query = queryStringBuilder<Q, N>(payment, nestedValues);
  return gql`
    query getPaymentSummaryByEmps($filter: PaymentInputType, $date_filter: DateStampInputType) {
      paymentSummaryEmp: getPaymentSummaryByEmps(filter: $filter, date_filter: $date_filter) {
        ${query}
      }
    }
  `;
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
export const graphGetPayments = (payment?: (keyof IPayment)[]) => {
  const query = payment ? payment.join(" ") : "_id";
  return gql`
    query getPayments($keyword: PaymentInputType, $date_filter: DateStampInputType, $limit: Int, $skip: Int) {
      payments: getPayments(keyword: $keyword, date_filter: $date_filter, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
