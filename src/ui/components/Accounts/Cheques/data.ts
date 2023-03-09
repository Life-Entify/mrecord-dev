import { FORM_FIELD_TYPES, IFormItems, TableColumnType } from "ui/common";
import { IBank, ICheque } from "../types";
import { RenderedCell } from "rc-table/lib/interface";

export const getChequeForm = (banks?: IBank[]): IFormItems[] => [
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "cheque_number",
      label: "Check Number",
      rules: [{ required: true }],
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.TEXT,
    itemProps: {
      name: "cheque_leaflet",
      label: "Leaflets",
      rules: [{ required: true }],
    },
    fieldProps: {
      type: "number",
    },
  },
  {
    fieldType: FORM_FIELD_TYPES.SELECT,
    itemProps: {
      name: "bank_id",
      label: "Bank",
      rules: [{ required: true }],
    },
    fieldProps: {
      options:
        banks?.map((bank) => ({
          value: bank._id,
          label: bank.bank,
        })) || [],
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

export const getChequeTableColumns = (
  removeColumns?: (keyof ICheque)[],
  render?: (
    keyIndex: string
  ) => (
    value: any,
    record: ICheque,
    index: number
  ) => React.ReactNode | RenderedCell<ICheque>
): TableColumnType<ICheque>[] => {
  const columns: TableColumnType<ICheque>[] = [
    {
      key: "cheque_number",
      dataIndex: "cheque_number",
      title: "Client",
      fixed: "left",
      render: render?.("cheque_number"),
    },
    {
      key: "bank_id",
      dataIndex: "bank_id",
      title: "Bank",
      fixed: "left",
      render: render?.("bank_id"),
    },
    {
      key: "cheque_leaflets",
      dataIndex: "cheque_leaflets",
      title(props) {
        return "Leaflets";
      },
      render: render?.("cheque_leaflets"),
    },
    {
      key: "description",
      dataIndex: "description",
      title(_) {
        return "Description";
      },
      render: render?.("description"),
    },
  ];
  if (removeColumns && removeColumns.length > 0) {
    for (let i = 0; i < removeColumns.length; i++) {
      const key = removeColumns[i];
      const index = columns.findIndex((item) => item.dataIndex === key);
      if (index !== -1) {
        columns.splice(index, 1);
      }
    }
  }
  return columns;
};
