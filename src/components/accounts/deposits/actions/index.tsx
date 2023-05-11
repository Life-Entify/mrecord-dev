import { useDeposit } from "app/graph.hooks/deposit";
import React, { useState } from "react";
import { IDepositBalance, INotify } from "ui";

export function useDepositAction() {
  const { getPersonDepositBalance } = useDeposit();
  const [personDepositBalance, setPersonDepositBalance] =
    useState<IDepositBalance>();
  const getPersonDepoBal = async (
    personId: number,
    options?: { notify?: INotify; noise?: boolean }
  ): Promise<IDepositBalance | undefined> => {
    try {
      const { data } = await getPersonDepositBalance({
        variables: {
          person_id: personId,
        },
      });
      const { depositBalance } = data || {};
      setPersonDepositBalance(depositBalance);
      options?.noise &&
        options?.notify?.("success", {
          key: "get-deposit-bal-success",
          message: "Success",
          description: "Fetched cheques",
        });
      return depositBalance;
    } catch (e) {
      options?.notify?.("error", {
        key: "get-deposit-bal-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };

  return {
    personDepositBalance,
    getPersonDepositBalance: getPersonDepoBal,
  };
}
