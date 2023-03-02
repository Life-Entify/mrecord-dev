import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IBank, IChequeForm } from "../types";
import { getChequeForm } from "./data";

const Root = styled.div``;

export interface INewChequeProps {
  onCreateItem?: (values: IChequeForm) => void;
  initialValues?: IChequeForm;
  banks?: IBank[];
}
function NewChequeFunc({
  onCreateItem,
  initialValues,
  banks,
}: INewChequeProps) {
  const formRef = React.useRef<FormInstance<IChequeForm>>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "income-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          onFinish: onCreateItem,
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
                  children: "Create Booklet",
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
