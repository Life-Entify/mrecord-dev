import { RenderedCell } from "rc-table/lib/interface";
import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { IBank } from "../types";

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
      name: "action_at",
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
  {
    fieldType: FORM_FIELD_TYPES.TEXT_AREA,
    itemProps: {
      name: "description",
      label: "Other description of account",
    },
  },
];

export const getBankTableColumns = (
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: IBank,
    index: number
  ) => React.ReactNode | RenderedCell<IBank>
): TableColumnType<IBank>[] => [
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
export const bankLabelMap: Record<keyof IBank, string> = {
  name: "Account Name",
  number: "Account Number",
  description: "Account Description",
  balance: "Account Balance",
  branch: "Bank Branch",
  bank: "Bank Name",
  _id: "ID",
};
