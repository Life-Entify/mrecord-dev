import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreateCheque,
  graphDeleteCheque,
  graphGetCheques,
  graphUpdateCheque,
} from "app/graph.queries/cheques";
import React from "react";
import { ICheque } from "ui";
interface IReturnedData {
  cheque: (keyof ICheque)[];
}
export interface IQChequeInput {
  cheque: Partial<ICheque>;
}
export interface IQChequeRes {
  cheque: ICheque;
}
const defaultValue: IReturnedData = {
  cheque: [
    "_id",
    "cheque_number",
    "bank_id",
    "cheque_leaflets",
    "used_leaflets",
    "created_at",
    "description",
  ],
};
export function useCheque(graphReturnedData: IReturnedData = defaultValue) {
  const [createCheque] = useMutation<IQChequeRes, IQChequeInput>(
    graphCreateCheque(graphReturnedData.cheque)
  );
  const [getCheques] = useLazyQuery<
    { cheques: ICheque[] },
    { keyword: Partial<ICheque> }
  >(graphGetCheques(graphReturnedData.cheque), {
    fetchPolicy: "network-only",
  });
  const [updateCheque] = useMutation<
    IQChequeRes,
    { _id: string; cheque: Partial<ICheque> }
  >(graphUpdateCheque(graphReturnedData.cheque));
  const [deleteCheque] = useMutation<{ _id: string }, { _id: string }>(
    graphDeleteCheque()
  );

  return {
    createCheque,
    getCheques,
    updateCheque,
    deleteCheque,
  };
}
