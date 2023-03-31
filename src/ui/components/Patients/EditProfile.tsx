import { FormInstance } from "antd";
import moment from "moment";
import React, { useCallback } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common/views";
import { patientToForm, spreadPatientData } from "./common";
import { patientForm } from "./data";
import { IFormPatient, IPatient } from "./types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;

export interface EditProfileFormProps {
  updateProfile?: (
    info?: Partial<IFormPatient>,
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
      const initState = patientToForm(patient as IPatient);
      const changes: Partial<IFormPatient> = {};
      for (const name in values) {
        if (Object.prototype.hasOwnProperty.call(values, name)) {
          const value = values[name as keyof IFormPatient];
          if (initState[name as keyof IFormPatient] !== value) {
            changes[name as keyof IFormPatient] = value;
          }
        }
      }
      if (changes?.dob) {
        values.dob = moment(values.dob).format("DD/MM/YYYY");
      }
      updateProfile?.(changes, undefined, { resetForm });
    },
    [!!updateProfile, JSON.stringify(patient)]
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
          initialValues: patient && { ...patientToForm(patient), dob: "" },
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
