import { FormInstance, Form as AntForm } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPaymentCategory, ITx, TxType } from "../types";
import { payTxCategoryForm } from "./data";

const Root = styled.div``;
const Title = styled.h3`
  text-align: center;
`;
const Description = styled.div`
  text-align: center;
`;
const CalcContainer = styled.div`
  margin-top: 20px;
  margin-left: 40px;
`;
const Calculator = styled.div``;
const Result = styled.h3`
  // background: grey;
`;
export interface INewPaymentCatProps {
  txType?: TxType;
  paymentTxs?: ITx[];
  incomeCats?: IPaymentCategory[];
  expenditureCats?: IPaymentCategory[];
  onContinue?: (values: ITx[]) => void;
}
function NewPaymentCatFunc({
  txType,
  paymentTxs,
  incomeCats,
  expenditureCats,
  onContinue,
}: INewPaymentCatProps) {
  const formRef = React.useRef<FormInstance<ITx>>(null);
  const [form, setForm] = useState<FormInstance>();
  const nameValue = AntForm.useWatch("category-list", form);
  let calc = "";
  let result = 0;
  if (nameValue && nameValue.length > 0) {
    nameValue?.map((item: any, index: number) => {
      if (!item || !item.amount) return;
      if (index === 0) calc = Number(item.amount).toLocaleString();
      else calc += ` + ${Number(item.amount).toLocaleString()}`;
      result += Number(item.amount);
    });
  }
  return (
    <Root>
      <Title>
        {txType === TxType.expenditure ? "Expenditure" : "Income"} Payment
      </Title>
      <Description>Add the category of payment and the amount</Description>
      <CalcContainer>
        <Calculator>Calculator: {calc}</Calculator>
        <Result>Total Amount: {Number(result).toLocaleString()}</Result>
      </CalcContainer>
      <Form
        formRef={formRef}
        getForm={(form) => {
          setForm(form);
        }}
        formProps={{
          name: "payment-cat-new-form",
          layout: "vertical",
          onFinish(values) {
            onContinue?.(values?.["category-list"]);
          },
          initialValues: { ["category-list"]: paymentTxs },
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
                  children: "Continue",
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
