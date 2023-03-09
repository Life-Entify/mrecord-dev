import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPaymentCategory, TxType } from "../types";
import { payTxCategoryForm } from "./data";

const Root = styled.div``;
const Title = styled.h3`
  text-align: center;
`;
export interface INewPaymentCatProps {
  txType?: TxType;
  incomeCats?: IPaymentCategory[];
  expenditureCats?: IPaymentCategory[];
}
function NewPaymentCatFunc({
  txType,
  incomeCats,
  expenditureCats,
}: INewPaymentCatProps) {
  const formRef = React.useRef<FormInstance<any>>(null);
  return (
    <Root>
      <Title>
        Select Category{" "}
        {txType === TxType.expenditure ? "Expenditure" : "Income"}
      </Title>
      <Form
        formRef={formRef}
        formProps={{
          name: "payment-new-form",
          layout: "vertical",
          // labelCol: { span: 10 },
          // wrapperCol: { span: 10 },
          style: {
            // alignItems: "center",
            // display: "flex",
            // justifyContent: "center",
            border: "solid",
          },
          // onFinish: onCreateItem,
          // initialValues,
        }}
        items={[
          ...payTxCategoryForm(
            txType === TxType.expenditure ? expenditureCats : incomeCats
          ),
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
                  children: "Create Payment",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
export const NewPaymentCat = React.memo(NewPaymentCatFunc);
