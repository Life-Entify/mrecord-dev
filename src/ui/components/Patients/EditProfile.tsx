import { FormInstance } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common/views";
import { spreadPatientData } from "./common";
import { patientForm } from "./data";
import { IFormPatient, IPatient } from "./types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;

export interface EditProfileFormProps {
  updateProfile?: (
    info?: IFormPatient,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => void;
  patient?: IPatient;
}
export function EditProfileForm({
  updateProfile,
  patient,
}: EditProfileFormProps) {
  const formRef = React.useRef<FormInstance>(null);
  const resetForm = () => {
    formRef.current?.resetFields();
  };
  const onFinish = useCallback(
    (values: IFormPatient) => {
      updateProfile && updateProfile(values, undefined, { resetForm });
    },
    [!!updateProfile]
  );
  return (
    <Root>
      <FormTitle>Profile</FormTitle>
      <Form
        formRef={formRef}
        formProps={{
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          layout: "horizontal",
          onFinish,
          //TODO:// spread date to single
          initialValues: { ...spreadPatientData(patient), dob: "" },
        }}
        items={[
          ...(patientForm ? patientForm : []),
          {
            fieldType: FORM_FIELD_TYPES.FIELDS,
            itemProps: {
              wrapperCol: { span: 14, offset: 10 },
              style: {},
            },
            fieldProps: [
              {
                fieldType: FORM_FIELD_TYPES.BUTTON,
                fieldProps: {
                  name: "update",
                  children: "Update Profile",
                  type: "primary",
                  htmlType: "submit",
                },
              },
            ],
          },
        ]}
      />
    </Root>
  );
}
