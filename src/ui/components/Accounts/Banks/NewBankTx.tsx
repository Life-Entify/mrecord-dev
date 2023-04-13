import { FormInstance } from "antd";
import React, { useEffect, useState } from "react";
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
export interface INewBankTxProps {
  title?: React.ReactNode;
  bankTx?: IBankTxMoment;
  onCreateBankTx?: (
    bankTx: IBankTx,
    formRef: React.RefObject<FormInstance<IBankTxMoment>>
  ) => void;
  onUpdateBankTx?: (
    bankTx?: Partial<IBankTx>,
    formRef?: React.RefObject<FormInstance<IBankTxMoment>>
  ) => void;
  isEdit?: boolean;
}

export function NewBankTx({
  title,
  bankTx,
  isEdit,
  onCreateBankTx,
  onUpdateBankTx,
}: INewBankTxProps) {
  const formRef =
    React.useRef<
      FormInstance<Omit<IBankTx, "created_at"> & { created_at: Moment }>
    >(null);
  const [formChanges, setFormChanges] = useState<Partial<IBankTx>>();
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
          onValuesChange(changedValues, values) {
            setFormChanges((state) => ({ ...state, ...changedValues }));
          },
          onFinish(values) {
            isEdit
              ? onUpdateBankTx?.(formChanges, formRef)
              : onCreateBankTx?.(values, formRef);
          },
        }}
        items={[
          ...bankTxInputForm(),
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
                  children: `${isEdit ? "Update " : "Create "} Transaction`,
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
