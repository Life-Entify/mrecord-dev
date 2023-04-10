import { usePaymentCategory } from "app/graph.hooks/payment_category";
import React, { useCallback, useEffect, useState } from "react";
import { IPaymentCategory, INotify, TxType } from "ui";
export interface IActionOptions {
  notify: INotify;
}
interface ICatState {
  income: IPaymentCategory[];
  expenditure: IPaymentCategory[];
}
export function usePaymentCategoryAction() {
  const {
    getPaymentCategories,
    createPaymentCategory,
    updatePaymentCategory,
    deletePaymentCategory,
  } = usePaymentCategory();
  const [paymentCategories, setPaymentCategories] = useState<ICatState>();
  const [searchKeyword, setSearchKeyword] = useState<Partial<IPaymentCategory>>(
    {}
  );

  const getPayCat = async (options?: { notify?: INotify; noise?: boolean }) => {
    await getIncomePayCat(options);
    setTimeout(() => {
      getExpenditurePayCat(options);
    }, 5000);
  };
  const getIncomePayCat = useCallback(
    async (options?: { notify?: INotify; noise?: boolean }) => {
      try {
        const { data } = await getPaymentCategories({
          variables: {
            keyword: {
              type: "income",
            },
          },
        });
        const { paymentCategories } = data || {};
        setPaymentCategories(
          (state) =>
            ({
              ...state,
              income: paymentCategories,
            } as ICatState)
        );
        options?.noise &&
          options?.notify?.("success", {
            key: "get-payCat-success",
            message: "Success",
            description: "Fetched paymentCategories",
          });
      } catch (e) {
        options?.notify?.("error", {
          key: "get-payCat-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [JSON.stringify(searchKeyword)]
  );
  const getExpenditurePayCat = useCallback(
    async (options?: { notify?: INotify; noise?: boolean }) => {
      try {
        const { data } = await getPaymentCategories({
          variables: {
            keyword: {
              type: "expenditure",
            },
          },
        });
        const { paymentCategories } = data || {};
        setPaymentCategories(
          (state) => ({ ...state, expenditure: paymentCategories } as ICatState)
        );
        options?.noise &&
          options?.notify?.("success", {
            key: "get-payCat-success",
            message: "Success",
            description: "Fetched paymentCategories",
          });
      } catch (e) {
        options?.notify?.("error", {
          key: "get-payCat-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [JSON.stringify(searchKeyword)]
  );
  useEffect(() => {
    getPayCat();
  }, [JSON.stringify(searchKeyword)]);

  const deletePayCat = useCallback(
    async (
      paymentCategoryId?: string,
      type?: TxType,
      options?: IActionOptions
    ) => {
      if (!paymentCategoryId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No PaymentCategory ID found!",
        });
      }
      try {
        await deletePaymentCategory({
          variables: { _id: paymentCategoryId },
        });
        if (type === TxType.expenditure) {
          getExpenditurePayCat(options);
        } else {
          getIncomePayCat(options);
        }
        options?.notify?.("success", {
          key: "delete-payCat-success",
          message: "Success",
          description: "PaymentCategory deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updatePaymentCategory]
  );
  const updatePayCat = useCallback(
    async (
      _id: string,
      payCat: Partial<IPaymentCategory>,
      type?: TxType,
      options?: IActionOptions
    ) => {
      if (Object.keys(payCat).length === 0) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        const { data } = await updatePaymentCategory({
          variables: {
            payment_category: payCat,
            _id,
          },
        });
        if (type === TxType.expenditure) {
          getExpenditurePayCat(options);
        } else {
          getIncomePayCat(options);
        }
        options?.notify?.("success", {
          key: "update-payCat-success",
          message: "Success",
          description: "PaymentCategory updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updatePaymentCategory]
  );
  const createPayCat = useCallback(
    async (
      paymentCategory: Partial<IPaymentCategory>,
      type: TxType,
      options?: IActionOptions
    ) => {
      try {
        await createPaymentCategory({
          variables: {
            payment_category: paymentCategory as IPaymentCategory,
          },
        });
        if (type === TxType.expenditure) {
          getExpenditurePayCat(options);
        } else {
          getIncomePayCat(options);
        }
        return options?.notify?.("success", {
          key: "create-payCat-success",
          message: "Success",
          description: "PaymentCategory created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-payCat-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createPaymentCategory]
  );
  useEffect(() => {
    getPayCat();
  }, []);

  return {
    paymentCategories,
    // getPaymentCategories: getPayCat,
    setSearchKeyword,
    createPaymentCategory: createPayCat,
    updatePaymentCategory: updatePayCat,
    deletePaymentCategory: deletePayCat,
  };
}
