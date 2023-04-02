import { FormInstance, FormProps } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IPayrollAction } from "../../types";
import { getPayrollActionForm } from "./data";

const Root = styled.div``;

export interface INewPayrollActionProps extends FormProps<IPayrollAction> {
  onOpenEmployees?: () => void;
  payrollAction?: IPayrollAction;
  isEdit?: boolean;
}
function NewDeductionFunc({
  onOpenEmployees,
  payrollAction,
  isEdit,
  ...formProps
}: INewPayrollActionProps) {
  const formRef = React.useRef<FormInstance<IPayrollAction>>(null);
  const numOfEmps = payrollAction?.employee_ids?.length || 0;
  return (
    <Root>
      {numOfEmps > 0 && <strong>Number of Employee: {numOfEmps}</strong>}
      <Form
        formRef={formRef}
        formProps={{
          name: "payment-new-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          initialValues: payrollAction,
          ...formProps,
        }}
        items={[
          ...getPayrollActionForm(onOpenEmployees),
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
                  children: `${isEdit ? "Update " : "Create "} Action`,
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
