import { gql } from "@apollo/client";
import { IPayrollAction } from "ui";

export const graphDeletePayrollAction = () => {
  return gql`
    mutation deletePayrollAction($_id: String) {
      _id: deletePayrollAction(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdatePayrollAction = (
  payroll_action?: (keyof IPayrollAction)[]
) => {
  const query = payroll_action ? payroll_action.join(" ") : "_id";
  return gql`
    mutation updatePayrollAction($_id: String, $payroll_action: PayrollActionInputType) {
        payroll_action : updatePayrollAction(_id: $_id, payroll_action: $payroll_action) {
            ${query}
        }
    }`;
};
export const graphCreatePayrollAction = (
  payroll_action?: (keyof IPayrollAction)[]
) => {
  const query = payroll_action ? payroll_action.join(" ") : "_id";
  return gql`
    mutation createPayrollAction($payroll_action : PayrollActionInputType) {
      payroll_action : createPayrollAction(payroll_action : $payroll_action) {
            ${query}
        }
    }`;
};
export const graphGetPayrollActions = (
  payroll_action?: (keyof IPayrollAction)[]
) => {
  const query = payroll_action ? payroll_action.join(" ") : "_id";
  return gql`
    query getPayrollActions($keyword: PayrollActionInputType, $limit: Int, $skip: Int) {
      payroll_actions: getPayrollActions(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
