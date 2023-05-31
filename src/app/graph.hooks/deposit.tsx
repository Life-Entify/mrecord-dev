import { useLazyQuery } from "@apollo/client";
import {
  graphGetDepositSummary,
  graphGetPersonDepositBalance,
} from "app/graph.queries/deposit";
import React from "react";
import { IDepositBalance, IPerson } from "ui";
export interface IDepositSummary {
  persons: IPerson[];
  deposit_info: {
    _id: { person_id: number; action_type: string };
    total_amount: number;
  };
}
interface IReturnedData {
  depositBalance: (keyof IDepositBalance)[];
}
const defaultValue: IReturnedData = {
  depositBalance: ["used", "deposit", "withdrawn"],
};
export function useDeposit(graphReturnedData: IReturnedData = defaultValue) {
  const [getDepositorDepositSummary] = useLazyQuery<
    {
      depositors: IDepositSummary;
    },
    { limit?: number; skip?: number }
  >(graphGetDepositSummary(graphReturnedData.depositBalance), {
    fetchPolicy: "network-only",
  });
  const [getPersonDepositBalance] = useLazyQuery<
    { depositBalance: IDepositBalance },
    { person_id?: number }
  >(graphGetPersonDepositBalance(graphReturnedData.depositBalance), {
    fetchPolicy: "network-only",
  });
  return {
    getPersonDepositBalance,
    getDepositorDepositSummary,
  };
}
