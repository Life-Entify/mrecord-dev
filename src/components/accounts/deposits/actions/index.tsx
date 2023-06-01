import { useDeposit } from "app/graph.hooks/deposit";
import React, { useCallback, useState } from "react";
import {
  AccountAction,
  IAccountDeposits,
  IDepositBalance,
  IDepositorSummary,
  INotify,
  IPerson,
} from "ui";

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
  const [depositSummary, setDepositSummary] = useState<IDepositorSummary[]>();
  const getDepositSummary = useCallback(async () => {
    try {
      const { data } = await getDepositorDepositSummary({
        variables: {
          limit: queryOptions?.limit,
          skip: queryOptions?.skip,
        },
      });
      const { depositors } = data || {};
      const { deposit_info, persons } = depositors || {};
      const depositorSumm: IDepositorSummary[] = [];
      if (deposit_info)
        for (let i = 0; i < deposit_info.length; i++) {
          const dSummary = deposit_info[i];
          const personIndex = depositorSumm.findIndex(
            (item) => item.person_id === dSummary._id.person_id
          );
          if (personIndex !== -1) {
            const actionType = dSummary._id.action_type as IAccountDeposits;
            depositorSumm[personIndex][actionType] = dSummary.total_amount;
          } else {
            const person = persons?.find(
              (p) => p.person_id === dSummary._id.person_id
            );
            if (person) {
              const actionType = dSummary._id.action_type as IAccountDeposits;
              const { last_name, first_name } = person.profile || {};
              const value: Partial<IDepositorSummary> = {};
              value.name = `${last_name || ""} ${first_name || ""}`;
              value[actionType] = dSummary.total_amount;
              value.person_id = dSummary._id.person_id;
              depositorSumm.push(value as IDepositorSummary);
            }
          }
        }
      setDepositSummary(
        depositorSumm?.map((i) => ({
          ...i,
          balance:
            (i.receive_deposit || 0) -
            (i.use_deposit || 0) -
            (i.deposit_withdrawal || 0),
        }))
      );
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
    setQueryOptions,
    personDepositBalance,
    getPersonDepositBalance: getPersonDepoBal,
    getDepositSummary,
    depositSummary,
  };
}
