import { FormInstance } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common";
import { IBank } from "../types";

const Root = styled.div``;

export interface INewBankProps<IBankType extends IBank> {
  onCreateItem?: (bank: IBankType) => void;
  inputFields: IFormItems[];
  isEdit?: boolean;
  onUpdateBank?: (bank: IBankType) => void;
  bank?: IBankType;
}

export function NewBank<IBankType extends IBank>({
  onCreateItem,
  inputFields,
  isEdit,
  onUpdateBank,
  bank,
}: INewBankProps<IBankType>) {
  const [bankChanges, setChanges] = useState<IBankType>();
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          // style: { width: "100%" },
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          initialValues: bank,
          onValuesChange(changedValues) {
            setChanges((state) => ({ ...state, ...changedValues }));
          },
          onFinish(values) {
            isEdit
              ? onUpdateBank?.(bankChanges as IBankType)
              : onCreateItem?.({ ...values, active: true });
          },
        }}
        items={[
          ...inputFields,
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
                  children: `${isEdit ? "Update " : "Create "} Bank`,
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
