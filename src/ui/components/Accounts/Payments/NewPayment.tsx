import { FormInstance, FormProps, Steps } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPerson } from "ui/components/Person";
import { IBank, ICheque, IPaymentForm, ITx, TxType } from "../types";
import { paymentForm } from "./data";

const Root = styled.div``;

export interface INewPaymentProps {
  openClient?: (form: React.RefObject<FormInstance<IPaymentForm>>) => void;
  openPaymentCategory?: (
    form: React.RefObject<FormInstance<IPaymentForm>>,
    txType: TxType
  ) => void;
  clientName?: string;
  formProps?: FormProps;
  cheques?: ICheque[];
  banks?: IBank[];
}

export function NewPayment({
  openClient,
  openPaymentCategory,
  formProps,
  cheques,
  banks,
  clientName,
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
          ...formProps,
        }}
        items={[
          ...paymentForm(
            () => openClient?.(formRef),
            (txType) => {
              openPaymentCategory?.(formRef, txType);
            },
            cheques,
            banks,
            clientName
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
