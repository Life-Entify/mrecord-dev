import { FormInstance, FormProps } from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  Form,
  FORM_FIELD_TYPES,
  IFormItems,
  IFormProps,
} from "ui/common/views";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;

export interface EditProfileFormProps<IFormProfile> {
  updateProfile?: (
    info?: IFormProfile,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => void;
  profileFormData?: IFormItems[];
  values?: IFormProfile;
  formProps?: FormProps;
}
export function EditProfileForm<IFormProfile>({
  updateProfile,
  profileFormData,
  values,
  formProps,
}: EditProfileFormProps<IFormProfile>) {
  const formRef = React.useRef<FormInstance>(null);
  const resetForm = () => {
    formRef.current?.resetFields();
  };
  const onFinish = useCallback(
    (values: IFormProfile) => {
      updateProfile && updateProfile(values, undefined, { resetForm });
    },
    [JSON.stringify(values), !!updateProfile]
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
          ...formProps,
        }}
        items={[
          ...(profileFormData ? profileFormData : []),
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
