import { FormInstance } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IBank, ICheque, IChequeForm } from "../types";
import { getChequeForm } from "./data";

const Root = styled.div``;

export interface INewChequeProps {
  cheque?: ICheque;
  isEdit?: boolean;
  onUpdateCheque?: (
    values: Partial<ICheque>,
    formRef?: React.RefObject<FormInstance<IChequeForm>>
  ) => void;
  onCreateCheque?: (
    values: IChequeForm,
    formRef?: React.RefObject<FormInstance<IChequeForm>>
  ) => void;
  initialValues?: IChequeForm;
  banks?: IBank[];
}
function NewChequeFunc({
  onCreateCheque,
  onUpdateCheque,
  initialValues,
  banks,
  cheque,
  isEdit,
}: INewChequeProps) {
  const formRef = React.useRef<FormInstance<IChequeForm>>(null);
  const [chequeChanges, setChequeChanges] = useState<Partial<ICheque>>();
  useEffect(() => {
    if (isEdit && cheque) {
      formRef.current?.setFieldsValue(cheque);
    }
  }, [JSON.stringify(cheque), isEdit]);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          onValuesChange(changedValues, values) {
            setChequeChanges((state) => ({ ...state, ...changedValues }));
          },
          onFinish(values) {
            isEdit
              ? onUpdateCheque?.(chequeChanges as Partial<ICheque>, formRef)
              : onCreateCheque?.(values, formRef);
          },
          initialValues,
        }}
        items={[
          ...getChequeForm(banks),
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
                  children: `${isEdit ? "Update " : "Create "} Booklet`,
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}

export const NewCheque = React.memo(NewChequeFunc);
