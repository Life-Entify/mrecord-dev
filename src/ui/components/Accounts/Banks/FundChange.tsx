import { Divider, FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IInfoBoardProps, InfoBoard } from "ui/common";
import { IBank, IBankFundChangeForm } from "../types";
import { BANK_EDIT_ACTIONS } from "./Banks";
import { bankFundEditForm, bankLabelMap } from "./data";

const Root = styled.div``;

export interface IBankFundChangeProps {
  bank?: IBank;
  bankAction?: BANK_EDIT_ACTIONS;
  infoBoardProps?: Omit<
    IInfoBoardProps<keyof IBank>,
    "data" | "dataMap" | "skipMap"
  >;
  onBankFundEdit?: (values: IBankFundChangeForm) => void;
}

export function BankFundChange({
  bank,
  bankAction,
  infoBoardProps,
  onBankFundEdit,
}: IBankFundChangeProps) {
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <InfoBoard<keyof IBank>
        {...infoBoardProps}
        title={bank?.bank}
        data={bank}
        dataMap={bankLabelMap}
        skipMap={["_id"]}
      />
      <Divider style={{ marginTop: 50 }} />
      <Form
        formRef={formRef}
        formProps={{
          onFinish: onBankFundEdit,
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        }}
        items={[
          ...bankFundEditForm,
          {
            fieldType: FORM_FIELD_TYPES.FIELDS,
            itemProps: {
              wrapperCol: { span: 14, offset: 10 },
            },
            fieldProps: [
              {
                fieldType: FORM_FIELD_TYPES.BUTTON,
                fieldProps: {
                  type: "primary",
                  htmlType: "submit",
                  children:
                    (bankAction === BANK_EDIT_ACTIONS.ADD
                      ? "Add "
                      : "Deduct ") + " Fund",
                  // onClick: onCreateItem,
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
