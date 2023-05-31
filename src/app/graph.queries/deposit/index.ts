import { gql } from "@apollo/client";
import { queryStringBuilder } from "app/utils";
import {
  IDepositBalance,
  IEmployee,
  IPaymentSummaryEmp,
  IPerson,
  IProfile,
} from "ui";

interface IDepositSummaryID {
  action_type: string;
  person_id: number;
}
interface IDepositSummary {
  deposit_info: {
    _id: IDepositSummaryID;
    total_amount: number;
  };
  persons: IPerson[];
}
interface IDepositSummaryNested {
  _id: (keyof IDepositSummaryID)[];
  deposit_info: (keyof {
    _id: IDepositSummaryID;
    total_amount: number;
  })[];
  persons: (keyof IPerson)[];
  profile: (keyof IProfile)[];
}
export const graphGetDepositSummary = <
  Q = IDepositSummary,
  N = IDepositSummaryNested
>(
  result?: (keyof Q)[],
  nestedValues?: N
) => {
  const query = queryStringBuilder<Q, N>(
    result as (keyof Q)[] | (keyof N)[],
    nestedValues
  );
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
