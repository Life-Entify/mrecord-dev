import { gql } from "@apollo/client";
import { queryStringBuilder } from "app/utils";
import { IDepositBalance, IEmployee, IPerson, IProfile } from "ui";

interface IDepositSummary {
  employee: (keyof IEmployee)[];
  deposit_info: ["_id", "total_amount"];
}
interface IDepositSummaryNested extends IDepositSummary {
  _id: ["action_type", "person_id"];
  person: (keyof IPerson)[];
  profile: (keyof IProfile)[];
}
export const graphGetDepositSummary = <
  Q = IDepositSummary,
  N = IDepositSummaryNested
>(
  payment?: (keyof Q)[] | (keyof N)[],
  nestedValues?: N
) => {
  const query = queryStringBuilder<Q, N>(payment, nestedValues);
  return gql`
    query getDepositSummaryByPersons($skip: Int, $limit: Int) {
      depositors: getDepositSummaryByPersons(skip: $skip, limit: $limit) {
        ${query}
      }
    }
  `;
};
export const graphGetPersonDepositBalance = (
  payment?: (keyof IDepositBalance)[]
) => {
  const query = payment ? payment.join(" ") : "deposit";
  return gql`
    query getPersonDepositBalance($person_id: Int) {
      depositBalance: getPersonDepositBalance(person_id: $person_id) {
        ${query}
      }
    }
  `;
};
