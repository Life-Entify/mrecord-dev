import { FormInstance } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common/views";
import { nextOfKinForm, patientForm } from "./data";
import { INextOfKin, IPatient } from "./types";

const Root = styled.div``;

export const NewPatient: React.FC<{
  createPatient?: (values: IPatient) => void;
  onChange?: React.FormEventHandler<HTMLFormElement>;
}> = ({ createPatient }) => {
  const formRef = React.useRef<FormInstance>(null);
  const PATIENT = "patient";
  const NEXTOFKIN = "nextOfKin";
  const [pageIndex, setPage] = useState<string>(PATIENT);
  const [patient, setPatient] = useState<IPatient>();
  const [nextOfKin, setNextOfKin] = useState<INextOfKin[]>([]);
  const resetForm = () => {
    setPage(PATIENT);
    formRef.current?.resetFields();
  };
  const onFinish = useCallback(
    (values: IPatient | INextOfKin) => {
      if (pageIndex === PATIENT) {
        setPatient(values as IPatient);
        setPage(NEXTOFKIN);
      } else {
        nextOfKin?.push(values as INextOfKin);
        let newPatient = {
          ...patient,
          nextOfKins: structuredClone(nextOfKin),
        };
        createPatient && createPatient(newPatient as IPatient);
        resetForm();
      }
    },
    [pageIndex, JSON.stringify(patient), JSON.stringify(nextOfKin)]
  );
  return (
    <Root>
      <Form
        formRef={formRef}
        formProps={{
          name: "patient-new-form",
          labelCol: { span: 8 },
          wrapperCol: { span: 14 },
          layout: "horizontal",
          onFinish,
        }}
        items={
          pageIndex === PATIENT
            ? [
                ...patientForm,
                {
                  fieldType: FORM_FIELD_TYPES.FIELDS,
                  itemProps: {
                    wrapperCol: { span: 14, offset: 8 },
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
                ...nextOfKinForm,
                {
                  fieldType: FORM_FIELD_TYPES.FIELDS,
                  itemProps: {
                    wrapperCol: { span: 14, offset: 8 },
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
};
