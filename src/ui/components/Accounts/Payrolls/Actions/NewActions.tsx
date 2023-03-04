import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPayrollAction } from "../../types";
import { getPayrollActionForm } from "./data";

const Root = styled.div``;

export interface INewPayrollActionProps {}
function NewDeductionFunc({}: INewPayrollActionProps) {
  const formRef = React.useRef<FormInstance<IPayrollAction>>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "payment-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          // onFinish: onCreateItem,
          // initialValues,
        }}
        items={[
          ...getPayrollActionForm(),
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
                  children: "Create Action",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
export const NewPayrollAction = React.memo(NewDeductionFunc);
