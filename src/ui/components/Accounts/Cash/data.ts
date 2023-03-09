import React from "react";
import { FORM_FIELD_TYPES, IFormItems } from "ui/common";
import { IBank, IPaymentCategory } from "../types";

export const getSpendCashForm = (
  categories?: IPaymentCategory[],
  inputSuffix?: React.ReactNode
): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "amount",
      label: "Amount",
      rules: [{ required: true }],
    },
    fieldProps: {
      suffix: inputSuffix,
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "category_id",
      label: "Expenditure Category",
      rules: [{ required: true }],
    },
    fieldProps: {
      options:
        categories?.map((cat) => ({
          value: cat._id,
          label: cat.title as string,
        })) || [],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "client",
      label: "Client",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description of account",
    },
    fieldProps: {
      maxLength: 100,
      showCount: true,
    },
  },
];
export const getCashMovementForm = (banks?: IBank[]): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "amount",
      label: "Amount",
      rules: [{ required: true }],
    },
    fieldProps: {
      disabled: true,
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "bank",
      label: "Bank",
      rules: [{ required: true }],
    },
    fieldProps: {
      options:
        banks?.map((bank) => ({ value: bank._id, label: bank.bank })) || [],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description of account",
    },
    fieldProps: {
      maxLength: 100,
      showCount: true,
    },
  },
];
