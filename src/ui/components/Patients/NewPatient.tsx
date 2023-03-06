import React from "react";
import styled from "styled-components";
import { INewPersonData, NewPerson } from "../Person";
import { patientForm } from "./data";
import { IFormPatient } from "./types";

const Root = styled.div``;
export interface INewPatientProps {
  createPatient?: (
    info?: INewPersonData<IFormPatient>,
    error?: Error,
    options?: {
      resetForm: () => void;
    }
  ) => void;
  values?: INewPersonData<IFormPatient>;
}
export function NewPatient({ createPatient, values }: INewPatientProps) {
  return (
    <Root>
      <NewPerson<IFormPatient>
        personForm={patientForm}
        values={values}
        createPerson={createPatient}
      />
    </Root>
  );
}
