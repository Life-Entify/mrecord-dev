import { FormInstance } from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common/views";
import { actionAddNoks, actionRemoveNoks } from "./common";
import { nextOfKinForm } from "./data";
import { IFormNextOfKin, IFormNextOfKinData, IFormPerson } from "./types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;
export interface INewPersonData<T extends IFormPerson> {
  profile: T;
  next_of_kins: IFormNextOfKinData[];
}
export interface INewPersonProps<T extends IFormPerson> {
  createPerson?: (
    info?: INewPersonData<T>,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => void;
  personForm?: IFormItems[];
  onChange?: React.FormEventHandler<HTMLFormElement>;
  values?: INewPersonData<T>;
}
export function NewPerson<T extends IFormPerson>({
  createPerson,
  personForm,
  values,
}: INewPersonProps<T>) {
  const formRef = React.useRef<FormInstance>(null);
  enum PAGE {
    PERSON,
    NEXT_OF_KIN,
  }
  const [pageIndex, setPage] = useState<PAGE>(PAGE.PERSON);
  const [person, setPatient] = useState<T>();
  const resetForm = () => {
    setPage(PAGE.PERSON);
    formRef.current?.resetFields();
  };
  const onFinish = useCallback(
    (values: T | IFormNextOfKin) => {
      if (pageIndex === PAGE.PERSON) {
        setPatient(values as T);
        setPage(PAGE.NEXT_OF_KIN);
      } else {
        const nextOfKin: IFormPerson[] = [
          actionRemoveNoks(values as IFormNextOfKin) as IFormPerson,
        ];
        if (!person) {
          createPerson &&
            createPerson(
              undefined,
              new Error(
                "person profile not returned from NewPerson Component (UI)"
              )
            );
          return;
        }
        createPerson &&
          createPerson(
            {
              profile: person,
              next_of_kins: nextOfKin,
            },
            undefined,
            { resetForm }
          );
      }
    },
    [pageIndex, JSON.stringify(person), !!createPerson]
  );
  return (
    <Root>
      <FormTitle>
        {pageIndex === PAGE.PERSON ? "Profile" : "Next of Kin"}
      </FormTitle>
      <Form
        formRef={formRef}
        formProps={{
          name: "patient-new-form",
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
          layout: "horizontal",
          onFinish,
          initialValues: {
            ...values?.profile,
            ...actionAddNoks(values?.next_of_kins?.[0] as IFormNextOfKinData),
          },
        }}
        items={
          pageIndex === PAGE.PERSON
            ? [
                ...(personForm ? personForm : []),
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
                ...(nextOfKinForm ? nextOfKinForm : []),
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
                        onClick: () => setPage(PAGE.PERSON),
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
