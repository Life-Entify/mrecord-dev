import { useLazyQuery } from "@apollo/client";
import { graphGetPersonDepositBalance } from "app/graph.queries/deposit";
import React from "react";
import { IDepositBalance } from "ui";
interface IReturnedData {
  depositBalance: (keyof IDepositBalance)[];
}
const defaultValue: IReturnedData = {
  depositBalance: ["used", "deposit", "withdrawn"],
};
export function useDeposit(graphReturnedData: IReturnedData = defaultValue) {
  const [getPersonDepositBalance] = useLazyQuery<
    { depositBalance: IDepositBalance },
    { person_id?: number }
  >(graphGetPersonDepositBalance(graphReturnedData.depositBalance), {
    fetchPolicy: "network-only",
  });
  return {
    getPersonDepositBalance,
  };
}
