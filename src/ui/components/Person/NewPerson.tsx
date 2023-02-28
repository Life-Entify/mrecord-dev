import { FormInstance } from "antd";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES, IFormItems } from "ui/common/views";
import { nextOfKinForm } from "./data";
import { IFormPerson } from "./types";

const Root = styled.div``;
const FormTitle = styled.h3`
  text-align: center;
`;
type IFormNextOfKin = Partial<IFormPerson>;
export interface INewPersonData<T extends IFormPerson> {
  profile: T;
  next_of_kins: IFormNextOfKin[];
}
export interface INewPersonProps<T extends IFormPerson> {
  createPatient?: (
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
  createPatient,
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
        const nextOfKin: IFormNextOfKin[] = [values as IFormNextOfKin];
        if (!person) {
          createPatient &&
            createPatient(
              undefined,
              new Error(
                "person profile not returned from NewPerson Component (UI)"
              )
            );
          return;
        }
        createPatient &&
          createPatient(
            {
              profile: person,
              next_of_kins: structuredClone(nextOfKin),
            },
            undefined,
            { resetForm }
          );
      }
    },
    [pageIndex, JSON.stringify(person), !!createPatient]
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
          initialValues:
            pageIndex === PAGE.PERSON
              ? values?.profile
              : values?.next_of_kins?.[0],
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
