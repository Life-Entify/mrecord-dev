import { FormInstance } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { bankTxInputForm } from "./data";
import { IBankTx, IOrgBank } from "../types";
import { Moment } from "moment";

const Root = styled.div``;
const FormTitle = styled.h3``;

export interface IBankTxMoment extends Omit<IBankTx, "created_at"> {
  created_at?: Moment;
}
export interface INewBankDepositTxProps {
  title?: React.ReactNode;
  banks?: IOrgBank[];
  bankTx?: IBankTxMoment;
  onCreateItem?: (
    bankTx: IBankTx,
    formRef: React.RefObject<FormInstance<IBankTxMoment>>
  ) => void;
}

export function NewBankTx({
  title,
  banks = [],
  bankTx,
  onCreateItem,
}: INewBankDepositTxProps) {
  const formRef =
    React.useRef<
      FormInstance<Omit<IBankTx, "created_at"> & { created_at: Moment }>
    >(null);
  useEffect(() => {
    if (bankTx) formRef.current?.setFieldsValue(bankTx);
  }, [JSON.stringify(bankTx)]);
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
          initialValues: bankTx,
          onFinish(values) {
            onCreateItem?.(values, formRef);
          },
        }}
        items={[
          ...bankTxInputForm(banks),
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
                  children: "Create Transaction",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
