import { RenderedCell } from "rc-table/lib/interface";
import React from "react";
import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { IOrgBank, IBankTx, PaymentType } from "../types";

export const bankFundEditForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "amount",
      label: "Amount",
      rules: [{ required: true }],
    },
    fieldProps: {
      type: "number",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "description",
      label: "Description",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.DATE,
    itemProps: {
      name: "created_at",
      label: "Date",
      rules: [{ required: true }],
    },
  },
];
export const bankInputForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "name",
      label: "Account Name",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "number",
      label: "Account Number",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "branch",
      label: "Bank Branch",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description of account",
    },
  },
];
export const orgBankInputForm: IFormItems[] = [
  ...bankInputForm,
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "balance",
      label: "Opening Balance",
      rules: [{ required: true }],
    },
    fieldProps: {
      type: "number",
    },
  },
];
export const bankTxInputForm: IFormItems[] = [
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "payment_type",
      label: "Payment Method",
      rules: [{ required: true }],
    },
    fieldProps: {
      options: [
        {
          value: PaymentType.cash,
          label: "Cash",
        },
        {
          value: PaymentType.cheque,
          label: "Cheque",
        },
        {
          value: PaymentType.transfer,
          label: "Transfer",
        },
      ],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "amount",
      label: "Amount",
      rules: [{ required: true }],
    },
    fieldProps: {
      type: "number",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "ref_id",
      label: "Ref ID",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Description",
      rules: [{ required: true }],
    },
    fieldProps: {
      showCount: true,
      maxLength: 250,
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.DATE,
    itemProps: {
      name: "created_at",
      label: "Date",
      rules: [{ required: true }],
    },
  },
];

export const getBankTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IOrgBank,
    index: number
  ) => React.ReactNode | RenderedCell<IOrgBank>
): TableColumnType<IOrgBank>[] => [
  {
    key: "bank",
    dataIndex: "bank",
    fixed: "left",
    title(props) {
      return "Bank Name";
    },
    render: render?.("bank"),
  },
  {
    key: "name",
    dataIndex: "name",
    fixed: "left",
    title(_) {
      return "Account Name";
    },
    render: render?.("name"),
  },
  {
    key: "number",
    dataIndex: "number",
    title: "Account Number",
    render: render?.("number"),
  },
  {
    key: "description",
    dataIndex: "description",
    title: "Description",
    render: render?.("description"),
  },
  {
    key: "balance",
    dataIndex: "balance",
    title: "Account Balance",
    render: render?.("balance"),
  },
  {
    key: "action",
    dataIndex: "action",
    fixed: "left",
    title: "Action",
    render: render?.("action"),
  },
];
export const bankLabelMap: Record<keyof IOrgBank, string> = {
  name: "Account Name",
  number: "Account Number",
  description: "Account Description",
  balance: "Account Balance",
  branch: "Bank Branch",
  bank: "Bank Name",
  _id: "ID",
};
export const getBankTxTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IBankTx,
    index: number
  ) => React.ReactNode | RenderedCell<IBankTx>
): TableColumnType<IBankTx>[] => [
  {
    key: "created_at",
    dataIndex: "created_at",
    fixed: "left",
    title(props) {
      return "Date";
    },
    render: render?.("created_at"),
  },
  {
    key: "tx_type",
    dataIndex: "tx_type",
    fixed: "left",
    title(props) {
      return "Tx Type";
    },
    render: render?.("tx_type"),
  },
  {
    key: "staff_id",
    dataIndex: "staff_id",
    fixed: "left",
    title(_) {
      return "Staff ID";
    },
    render: render?.("staff_id"),
  },
  {
    key: "ref_id",
    dataIndex: "ref_id",
    title: "Tx Ref",
    render: render?.("ref_id"),
  },
  {
    key: "amount",
    dataIndex: "amount",
    title: "Amount",
    render: render?.("amount"),
  },
  {
    key: "action",
    dataIndex: "action",
    title: "Action",
    render: render?.("action"),
  },
];
export const bankTxLabelMap: Record<keyof IBankTx, React.ReactNode> = {
  _id: "Tx ID",
  ref_id: "Tx Ref",
  description: "Account Description",
  bank_id: "Bank ID",
  staff_id: "Staff ID",
  tx_type: "Tx Type",
  amount: "Amount",
  created_at: "Date",
  payment_id: "Payment ID",
  bank: "",
  staff: "",
  payment: "",
};
