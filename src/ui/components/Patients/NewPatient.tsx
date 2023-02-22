import { FormInstance } from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common/views";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;

export interface INewPatientData<IFormProfile, IFormNextOfKin> {
  profile: IFormProfile;
  next_of_kins: IFormNextOfKin[];
}
export interface INewPatientProps<IFormProfile, IFormNextOfKin> {
  createPatient?: (
    info?: INewPatientData<IFormProfile, IFormNextOfKin>,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => void;
  patientFormData?: IFormItems[];
  nextOfKinFormData?: IFormItems[];
  onChange?: React.FormEventHandler<HTMLFormElement>;
  values?: INewPatientData<Partial<IFormProfile>, Partial<IFormNextOfKin>>;
}
export function NewPatient<IFormProfile, IFormNextOfKin>({
  createPatient,
  patientFormData,
  nextOfKinFormData,
  values,
}: INewPatientProps<IFormProfile, IFormNextOfKin>) {
  const formRef = React.useRef<FormInstance>(null);
  const PATIENT = "patient";
  const NEXTOFKIN = "nextOfKin";
  const [pageIndex, setPage] = useState<string>(PATIENT);
  const [patient, setPatient] = useState<IFormProfile>();
  const resetForm = () => {
    setPage(PATIENT);
    formRef.current?.resetFields();
  };
  const onFinish = useCallback(
    (values: IFormProfile | IFormNextOfKin) => {
      if (pageIndex === PATIENT) {
        setPatient(values as IFormProfile);
        setPage(NEXTOFKIN);
      } else {
        const nextOfKin: IFormNextOfKin[] = [values as IFormNextOfKin];
        if (!patient) {
          createPatient &&
            createPatient(
              undefined,
              new Error(
                "patient profile not returned from NewPatient Component (UI)"
              )
            );
          return;
        }
        createPatient &&
          createPatient(
            {
              profile: patient,
              next_of_kins: structuredClone(nextOfKin),
            },
            undefined,
            { resetForm }
          );
      }
    },
    [pageIndex, JSON.stringify(patient), !!createPatient]
  );
  return (
    <Root>
      <FormTitle>{pageIndex === PATIENT ? "Profile" : "Next of Kin"}</FormTitle>
      <Form
        formRef={formRef}
        formProps={{
          name: "patient-new-form",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          layout: "horizontal",
          onFinish,
          initialValues:
            pageIndex === PATIENT ? values?.profile : values?.next_of_kins?.[0],
        }}
        items={
          pageIndex === PATIENT
            ? [
                ...(patientFormData ? patientFormData : []),
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
                        name: "reset",
                        children: "Reset",
                        onClick: () => formRef.current?.resetFields(),
                      },
                    },
                    {
                      fieldType: FORM_FIELD_TYPES.BUTTON,
                      fieldProps: {
                        name: "next",
                        children: "Next",
                        type: "primary",
                        style: { marginLeft: 10 },
                        htmlType: "submit",
                      },
                    },
                  ],
                },
              ]
            : [
                ...(nextOfKinFormData ? nextOfKinFormData : []),
                {
                  fieldType: FORM_FIELD_TYPES.FIELDS,
                  itemProps: {
                    wrapperCol: { span: 14, offset: 10 },
                  },
                  fieldProps: [
                    {
                      fieldType: FORM_FIELD_TYPES.BUTTON,
                      fieldProps: {
                        name: "prev",
                        children: "Back",
                        onClick: () => setPage(PATIENT),
                      },
                    },
                    {
                      fieldType: FORM_FIELD_TYPES.BUTTON,
                      fieldProps: {
                        name: "next",
                        children: "Finish",
                        type: "primary",
                        htmlType: "submit",
                        style: { marginLeft: 10 },
                      },
                    },
                  ],
                },
              ]
        }
      />
    </Root>
  );
}
