import { FormInstance } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { Form, FORM_FIELD_TYPES } from "ui/common";
import { IDepartment } from "../Departments";
import { Patients } from "../Patients";
import { IPatient } from "../Patients/types";
import { getAppointmentForm } from "./data";
import { IAppointment } from "./types";

const Root = styled.div``;
const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`;

enum PAGES {
  PATIENT,
  FORM,
}

export interface INewAppointmentProps {
  patients?: IPatient[];
  departments?: IDepartment[];
  isEdit?: boolean;
  onCreateItem?: (values: IAppointment) => void;
}

function NewAppointmentFunc({
  patients,
  departments,
  isEdit = false,
  onCreateItem,
}: INewAppointmentProps) {
  const [patient, setPatient] = useState<IPatient>();
  const [page, setPage] = useState<PAGES>(PAGES.PATIENT);
  const formRef = React.useRef<FormInstance>(null);
  const { last_name, first_name } = patient?.person?.profile || {};
  const name = `${last_name} ${first_name}`;
  return (
    <Root>
      {page === PAGES.PATIENT && (
        <Patients
          toolbarProps={{
            searchProps: {},
          }}
          tableProps={{
            dataSource: patients,
            rowSelection: {
              type: "radio",
              onSelect(record) {
                setPatient(record);
                setPage(PAGES.FORM);
              },
            },
          }}
        />
      )}
      {page === PAGES.FORM && (
        <>
          <Title>RE: {name}</Title>
          <Form
            formRef={formRef}
            formProps={{
              // style: { width: "100%" },
              name: "new-department-form",
              layout: "horizontal",
              labelCol: { span: 10 },
              wrapperCol: { span: 14 },
              onFinish: (values) => {
                onCreateItem?.({ ...values, patient_id: patient?._id });
              },
            }}
            items={[
              ...getAppointmentForm(departments),
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
                      children:
                        (isEdit ? "Update " : "Create ") + "Appointment",
                    },
                  },
                ],
              },
            ]}
          />
        </>
      )}
    </Root>
  );
}

export const NewAppointment = React.memo(NewAppointmentFunc);
