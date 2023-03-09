import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common";

const Root = styled.div``;

export interface INewBankProps {
  onCreateItem?: React.MouseEventHandler<HTMLDivElement>;
  inputFields: IFormItems[];
}

export function NewBank({ onCreateItem, inputFields }: INewBankProps) {
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
          onFinish: onCreateItem
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
                  children: "Create Bank",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
