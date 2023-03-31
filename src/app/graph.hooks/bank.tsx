import {
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  graphCreateBank,
  graphDeleteBank,
  graphGetBanks,
  graphUpdateBank,
} from "app/graph.queries/banks";
import React from "react";
import { IOrgBank } from "ui";
interface IReturnedData {
  bank: (keyof IOrgBank)[];
}
export interface IQBankInput {
  bank: Partial<IOrgBank>;
}
export interface IQBankRes {
  bank: IOrgBank;
}
const defaultValue: IReturnedData = {
  bank: [
    "_id",
    "description",
    "name",
    "number",
    "branch",
    "bank",
    "is_admin",
    "active",
  ],
};
export function useBank(graphReturnedData: IReturnedData = defaultValue) {
  const [createBank] = useMutation<IQBankRes, IQBankInput>(
    graphCreateBank(graphReturnedData.bank)
  );
  const [getBanks] = useLazyQuery<
    { banks: IOrgBank[] },
    { keyword: Partial<IOrgBank> }
  >(graphGetBanks(graphReturnedData.bank), {
    fetchPolicy: "network-only",
  });
  const [updateBank] = useMutation<
    IQBankRes,
    { _id: string; bank: Partial<IOrgBank> }
  >(graphUpdateBank(graphReturnedData.bank));
  const [deleteBank] = useMutation<{ _id: string }, { _id: string }>(
    graphDeleteBank()
  );

  return {
    createBank,
    getBanks,
    updateBank,
    deleteBank,
  };
}
