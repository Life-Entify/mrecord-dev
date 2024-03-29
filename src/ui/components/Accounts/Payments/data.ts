import React from "react";
import { FORM_FIELD_TYPES, IFormItems, IFieldsProps } from "ui/common";
import {
  AccountAction,
  IBank,
  ICheque,
  IExpenditureAction,
  IIncomeActions,
  IPayment,
  IPaymentCategory,
  PaymentType,
  TxType,
} from "../types";

export const expenditures: (keyof typeof IExpenditureAction)[] = [
  "deposit_withdrawal",
  "loan",
  "pay",
];
export const externalIncome: (keyof typeof IIncomeActions)[] = [
  "receive_deposit",
  "receive_pay",
  "loan_repayment",
  "redeem_credit",
];
export const internalPayment: (keyof typeof AccountAction)[] = [
  "use_deposit",
  "register_credit",
];

export const paymentLabelMap: Record<keyof IPayment, React.ReactNode> = {
  _id: "ID",
  pay_type: "Payment Type",
  tx_type: "Transaction Type",
  action_type: "Action",
  person_id: "Person (ID)",
  person: "Person",
  employee_id: "Staff (ID)",
  tx_ids: "Transaction ID(s)",
  txs: "Transactions",
  total_amount: "Total Amount",
  created_at: "Date",
  description: "Description",
  unresolved: "Unresolved",
  bank_id: "Bank ID",
  employee: "Employee",
  client: "Client",
  cheque_id: "Cheque ID",
};
export const payTxCategoryForm = (
  categories?: IPaymentCategory[]
): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.LIST,
    itemProps: {
      name: "category",
      rules: [{ required: true }],
    },
    fieldProps: [
      {
        fieldType: FORM_FIELD_TYPES.SELECT,
        itemProps: {
          name: "category_id",
          label: "Category",
          style: { width: 300 },
        },
        fieldProps: {
          options: categories?.map((cat) => ({
            value: cat._id,
            label: cat.title as string,
          })),
        },
      },
      {
        fieldType: FORM_FIELD_TYPES.TEXT,
        itemProps: {
          name: "amount",
          label: "Amount",
          style: { width: 200 },
        },
        fieldProps: {
          type: "number",
          width: 600,
        },
      },
    ],
  },
];
export const paymentForm = ({
  openClient,
  openCategory,
  cheques,
  banks,
  clientName,
  resetTxs,
  isEdit,
}: {
  openClient?: React.MouseEventHandler;
  openCategory?: (txType: TxType) => void;
  cheques?: ICheque[];
  banks?: IBank[];
  clientName?: string;
  resetTxs?: () => void;
  isEdit?: boolean;
}): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.TREE_SELECT,
    itemProps: {
      name: "action_type",
      label: "Transaction",
      rules: [{ required: true }],
    },
    fieldProps: {
      disabled: isEdit,
      treeData: [
        {
          value: TxType.expenditure,
          title: "Expenditure",
          disabled: true,
          children: [
            { value: AccountAction.pay, title: "Make Payment" },
            {
              value: AccountAction.deposit_withdrawal,
              title: "Withdraw Deposit",
            },
            // { value: AccountAction.loan, title: "Loan" },
          ],
        },
        {
          value: TxType.income,
          title: "Income",
          disabled: true,
          children: [
            { value: AccountAction.receive_pay, title: "Receive Payment" },
            { value: AccountAction.receive_deposit, title: "Receive Deposit" },
            { value: AccountAction.redeem_credit, title: "Redeem Debt" },
            // { value: AccountAction.loan_repayment, title: "Loan Repayment" },
          ],
        },
        {
          value: `internal ${TxType.income}`,
          title: "Internal Income",
          disabled: true,
          children: [
            { value: AccountAction.use_deposit, title: "Use Deposit" },
            { value: AccountAction.register_credit, title: "As Credit" },
            // { value: AccountAction.loan_repayment, title: "Loan Repayment" },
          ],
        },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return (
          !prevValues.action_type ||
          prevValues.action_type !== currentValues.action_type
        );
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      const actionType = formInstance?.getFieldValue?.("action_type");
      return !internalPayment.includes(actionType)
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.SELECT,
      itemProps: {
        name: "pay_type",
        label: "Payment Type",
      },
      fieldProps: {
        options: [
          { value: PaymentType.cash, label: "Cash" },
          { value: PaymentType.transfer, label: "Transfer" },
          { value: PaymentType.cheque, label: "Cheque" },
        ],
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return (
          prevValues.pay_type !== currentValues.pay_type ||
          prevValues.action_type !== currentValues.action_type
        );
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return expenditures.includes(
        formInstance?.getFieldValue?.("action_type")
      ) && formInstance?.getFieldValue?.("pay_type") === PaymentType.cheque
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.SELECT,
      itemProps: {
        name: "cheque_id",
        label: "Cheque",
      },
      fieldProps: {
        options: cheques?.map((cheque) => ({
          value: cheque?._id as string,
          label: `${cheque?.cheque_number} (${cheque?.bank?.bank})` as string,
        })),
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return (
          prevValues.action_type !== currentValues.action_type ||
          prevValues.pay_type !== currentValues.pay_type
        );
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return formInstance?.getFieldValue?.("action_type") !==
        IIncomeActions.register_credit &&
        formInstance?.getFieldValue?.("pay_type") === PaymentType.transfer
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.SELECT,
      itemProps: {
        name: "bank_id",
        label: "Bank",
      },
      fieldProps: {
        options: banks?.map((bank) => ({
          value: bank?._id,
          label: bank.bank,
        })),
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.action_type !== currentValues.action_type;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return formInstance?.getFieldValue?.("action_type") !==
        AccountAction.deposit_withdrawal
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.SWITCH,
      itemProps: {
        name: "use_client",
        label: "Use Saved Client",
      },
      fieldProps: {
        disabled: isEdit,
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.use_client !== currentValues.use_client;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return formInstance?.getFieldValue?.("action_type") !==
        AccountAction.deposit_withdrawal &&
        !formInstance?.getFieldValue?.("use_client")
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.TEXT,
      itemProps: {
        name: "client",
        label: "Client",
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return (
          prevValues.action_type !== currentValues.action_type ||
          prevValues.use_client !== currentValues.use_client
        );
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      return formInstance?.getFieldValue?.("action_type") ===
        AccountAction.deposit_withdrawal ||
        formInstance?.getFieldValue?.("use_client")
        ? fieldData && fieldForm?.(fieldData)
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.FIELDS,
      itemProps: {
        name: "client",
        label: "Client",
      },
      fieldProps: [
        {
          fieldType: FORM_FIELD_TYPES.BUTTON,
          fieldProps: {
            children: clientName || "Open Client",
            onClick: openClient,
            disabled: isEdit,
          },
        },
      ],
    },
  },
  //here
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.action_type !== currentValues.action_type;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      const value = formInstance?.getFieldValue?.("action_type");
      return [
        AccountAction.receive_pay,
        AccountAction.register_credit,
      ].includes(value)
        ? fieldData &&
            fieldForm?.({
              ...fieldData,
              fieldProps: [
                {
                  ...(fieldData.fieldProps as IFieldsProps[])?.[0],
                  fieldProps: {
                    ...(fieldData.fieldProps as IFieldsProps[])?.[0]
                      ?.fieldProps,
                    onClick: () => {
                      openCategory?.(
                        value === AccountAction.pay
                          ? TxType.expenditure
                          : TxType.income
                      );
                    },
                  },
                },
              ],
            })
        : (() => {
            resetTxs?.();
            return null;
          })();
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.FIELDS,
      itemProps: {
        name: "category_id",
        label: "Categories",
      },
      fieldProps: [
        {
          fieldType: FORM_FIELD_TYPES.BUTTON,
          fieldProps: {
            children: "Select Tx Category",
          },
        },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.HIDDEN,
    itemProps: {
      noStyle: true,
      shouldUpdate: (prevValues, currentValues) => {
        return prevValues.action_type !== currentValues.action_type;
      },
    },
    itemFunc(formInstance, fieldForm, fieldData) {
      const value = formInstance?.getFieldValue?.("action_type");
      const disabled = [
        AccountAction.deposit_withdrawal,
        AccountAction.use_deposit,
      ].includes(value);
      return ![AccountAction.receive_pay].includes(value)
        ? fieldData &&
            fieldForm?.({
              ...fieldData,
              fieldProps: {
                ...fieldData.fieldProps,
                disabled,
              } as any,
            })
        : null;
    },
    fieldProps: {
      fieldType: FORM_FIELD_TYPES.TEXT,
      itemProps: {
        name: "total_amount",
        label: "Amount",
      },
      fieldProps: {
        type: "number",
      },
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.DATE,
    itemProps: {
      name: "created_at",
      label: "Date",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description",
    },
  },
];
