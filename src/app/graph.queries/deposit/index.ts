import { gql } from "@apollo/client";
import { IDepositBalance } from "ui";

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
