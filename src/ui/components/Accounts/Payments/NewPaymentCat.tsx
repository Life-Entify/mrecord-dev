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
  isEdit?: boolean;
  paymentTxs?: ITx[];
  incomeCats?: IPaymentCategory[];
  expenditureCats?: IPaymentCategory[];
  onContinue?: (values?: ITx[]) => void;
  onContinueEdit?: (values?: ITx[]) => void;
}
function NewPaymentCatFunc({
  txType,
  paymentTxs,
  incomeCats,
  expenditureCats,
  onContinue,
  isEdit,
  onContinueEdit,
}: INewPaymentCatProps) {
  const formRef = React.useRef<FormInstance<ITx>>(null);
  const [fieldChanges, setFieldChanges] = useState<ITx[]>();
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
        isEdit={isEdit}
        formRef={formRef}
        getForm={(form) => {
          setForm(form);
        }}
        formProps={{
          name: "payment-cat-new-form",
          layout: "vertical",
          onValuesChange(changedValues) {
            let changedIndex;
            const values = changedValues["category-list"] as ITx[];
            values.forEach((_: ITx, index: number) => {
              changedIndex = index;
            });
            if (changedIndex !== undefined) {
              if (fieldChanges?.[changedIndex]) {
                fieldChanges[changedIndex] = {
                  ...(fieldChanges[changedIndex] as ITx),
                  ...values[changedIndex],
                };
                setFieldChanges([...fieldChanges]);
              } else if (fieldChanges) {
                fieldChanges[changedIndex] = values[changedIndex];
                setFieldChanges([...fieldChanges]);
              } else {
                setFieldChanges(values);
              }
            }
          },
          onFinish(values) {
            if (isEdit) {
              onContinueEdit?.(fieldChanges);
            } else {
              onContinue?.(values?.["category-list"]);
            }
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
