import { IDepositSummary, useDeposit } from "app/graph.hooks/deposit";
import React, { useCallback, useState } from "react";
import { IDepositBalance, INotify } from "ui";

interface IQueryOptions {
  limit: number;
  skip: number;
}
export function useDepositAction() {
  const { getPersonDepositBalance, getDepositorDepositSummary } = useDeposit();
  const [personDepositBalance, setPersonDepositBalance] =
    useState<IDepositBalance>();
  const [queryOptions, _setQueryOptions] = useState<Partial<IQueryOptions>>();
  const setQueryOptions = (_state: Partial<IQueryOptions>) =>
    _setQueryOptions((state) => ({
      ...state,
      ..._state,
    }));
  const [depositSummary, setDepositSummary] = useState<IDepositSummary>();
  const getDepositSummary = useCallback(async () => {
    try {
      const { data } = await getDepositorDepositSummary({
        variables: {
          limit: queryOptions?.limit,
          skip: queryOptions?.skip,
        },
      });
      const { depositors } = data || {};
      setDepositSummary(depositors);
    } catch (e) {}
  }, [JSON.stringify(queryOptions)]);
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
    getDepositSummary,
    depositSummary,
  };
}
