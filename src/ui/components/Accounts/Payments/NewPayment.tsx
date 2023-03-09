import { FormInstance, Steps } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IBank, ICheque, IPaymentForm, TxType } from "../types";
import { paymentForm } from "./data";

const Root = styled.div``;

export interface INewPaymentProps {
  onCreateItem?: (values: IPaymentForm) => void;
  openClient?: (form: React.RefObject<FormInstance<IPaymentForm>>) => void;
  openPaymentCategory?: (
    form: React.RefObject<FormInstance<IPaymentForm>>,
    txType: TxType
  ) => void;

  initialValues?: IPaymentForm;
  cheques?: ICheque[];
  banks?: IBank[];
}

export function NewPayment({
  onCreateItem,
  openClient,
  openPaymentCategory,
  initialValues,
  cheques,
  banks,
}: INewPaymentProps) {
  const formRef = React.useRef<FormInstance<IPaymentForm>>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "payment-new-form",
          layout: "horizontal",
          labelCol: { span: 8 },
          wrapperCol: { span: 14 },
          onFinish: onCreateItem,
          initialValues,
        }}
        items={[
          ...paymentForm(
            () => openClient?.(formRef),
            (txType) => {
              openPaymentCategory?.(formRef, txType);
            },
            cheques,
            banks
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
