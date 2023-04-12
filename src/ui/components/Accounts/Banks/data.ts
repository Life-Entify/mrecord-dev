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
      name: "bank",
      label: "Bank Name",
      rules: [{ required: true }],
    },
  },
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
export const bankTxInputForm = (banks?: IOrgBank[]): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "bank_id",
      label: "Bank",
      rules: [{ required: true }],
    },
    fieldProps: {
      options: banks?.map((bank) => ({
        value: bank._id,
        label: bank.bank as string,
      })),
    },
  },
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
    key: "_id",
    dataIndex: "_id",
    fixed: "left",
    title(props) {
      return "ID";
    },
    render(value, record, index) {
      value = String(value).substring(value.length - 4);
      return render?.("_id")(value, record, index) || value;
    },
  },
  {
    key: "bank",
    dataIndex: "bank",
    fixed: "left",
    title(props) {
      return "Bank";
    },
    render: render?.("bank"),
  },
  {
    key: "name",
    dataIndex: "name",
    fixed: "left",
    title(_) {
      return "Name";
    },
    render: render?.("name"),
  },
  {
    key: "number",
    dataIndex: "number",
    title: "Number",
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
    title: "Balance",
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
  is_admin: "Admin Bank",
  active: "Status",
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
    render(value, record, index) {
      const dateString = new Date(value).toLocaleDateString();
      return render?.("created_at")(dateString, record, index) || dateString;
    },
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
    key: "employee_id",
    dataIndex: "employee_id",
    fixed: "left",
    title(_) {
      return "Staff ID";
    },
    render: render?.("employee_id"),
  },
  {
    key: "description",
    dataIndex: "description",
    title: "Description",
    render: render?.("description"),
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
  description: "Account Description",
  bank_id: "Bank ID",
  employee_id: "Staff ID",
  tx_type: "Tx Type",
  amount: "Amount",
  created_at: "Date",
  payment_type: "",
  bank: "Bank",
  employee: "Employee",
  payment_id: "Payment ID",
};
