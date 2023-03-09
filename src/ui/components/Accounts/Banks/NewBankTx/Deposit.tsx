import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPaymentCategory } from "../../types";
import { bankTxInputForm } from "../data";

const Root = styled.div``;
const FormTitle = styled.h3``;

export interface INewBankDepositTxProps {
  title?: React.ReactNode;
  category?: IPaymentCategory[];
  onCreateItem?: React.MouseEventHandler
}

export function NewBankDepositTx({
  title,
  category = [],
  onCreateItem
}: INewBankDepositTxProps) {
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <FormTitle>{title}</FormTitle>
      <Form
        formRef={formRef}
        formProps={{
          // style: { width: "100%" },
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          onFinish: onCreateItem
        }}
        items={[
          ...bankTxInputForm,
          {
            fieldType: FORM_FIELD_TYPES.SELECT,
            itemProps: {
              label: "Category",
              name: "category_id",
              rules: [{ required: true }],
            },
            fieldProps: {
              options: category.map((cat) => ({
                value: cat._id,
                label: cat.title as string,
              })),
            },
          },
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
                  children: "Create Transaction"
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
