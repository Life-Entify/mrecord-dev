import { FormInstance } from "antd";
import React from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { departmentForm } from "./data";
import { IDepartment } from "./types";

const Root = styled.div``;

export interface INewDepartmentProps {
  onCreateItem?: (values: Partial<IDepartment>) => void;
  isEdit?: boolean;
  department?: IDepartment;
}

function NewDepartmentFunc({
  onCreateItem,
  isEdit,
  department,
}: INewDepartmentProps) {
  const formRef = React.useRef<FormInstance>(null);
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          // style: { width: "100%" },
          name: "new-department-form",
          layout: "horizontal",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          initialValues: department,
          onFinish: onCreateItem,
        }}
        items={[
          ...departmentForm,
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
                  children: (isEdit ? "Update " : "Create ") + "Department",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}

export const NewDepartment = React.memo(NewDepartmentFunc);
