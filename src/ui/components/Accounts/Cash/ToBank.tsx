import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IBank, ICashBundle } from "../types";
import { getCashMovementForm } from "./data";

const Root = styled.div``;

export interface IToBankProps {
  bundle?: ICashBundle;
  onCreateItem?: React.MouseEventHandler;
  banks?: IBank[];
}

export function ToBank({ bundle, onCreateItem, banks }: IToBankProps) {
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          initialValues: {
            amount: bundle?.total_amount,
          },
          onFinish: onCreateItem,
        }}
        items={[
          ...getCashMovementForm(banks),
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
                  children: "Move Cash",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
