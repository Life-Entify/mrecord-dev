import { usePaymentCategory } from "app/graph.hooks/payment_category";
import React, { useCallback, useEffect, useState } from "react";
import { IPaymentCategory, INotify, ITx } from "ui";
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
  const [paymentCategory, setPaymentCategory] = useState<IPaymentCategory>();
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
    async (paymentCategoryId?: string, options?: IActionOptions) => {
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
        await getPayCat({ ...options });
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
    [!!updatePaymentCategory, JSON.stringify(paymentCategory)]
  );
  const updatePayCat = useCallback(
    async (payCat: Partial<IPaymentCategory>, options?: IActionOptions) => {
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
            paymentCategory: payCat,
            _id: paymentCategory?._id as string,
          },
        });
        await getPayCat({ notify: options?.notify });
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
    [!!updatePaymentCategory, JSON.stringify(paymentCategory)]
  );
  const createPayCat = useCallback(
    async (
      paymentCategory: Partial<IPaymentCategory>,
      txs?: Partial<ITx>[],
      options?: IActionOptions
    ) => {
      try {
        await createPaymentCategory({
          variables: {
            paymentCategory: paymentCategory as IPaymentCategory,
          },
        });
        await getPayCat({ notify: options?.notify });
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
    paymentCategory,
    setPaymentCategory,
    // getPaymentCategories: getPayCat,
    setSearchKeyword,
    createPaymentCategory: createPayCat,
    updatePaymentCategory: updatePayCat,
    deletePaymentCategory: deletePayCat,
  };
}
