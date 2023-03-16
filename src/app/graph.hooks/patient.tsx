import {
  FetchResult,
  LazyQueryExecFunction,
  MutationFunctionOptions,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  graphCreatePatient,
  graphCreatePtWithPerson,
  graphCreatePtWithNok,
  graphCreatePtWithMeta,
  graphGetPatients,
  graphUpdatePatient,
} from "app/graph.queries/patients";
import {
  QPatientQueryParams,
  QTransferPatient,
  QTransferPtWithMeta,
  QTransferPtWithNok,
  QTransferPtWithPerson,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import React from "react";
import { IPatient } from "ui/components/Patients/types";
import { IAddress, INextOfKin, IPerson, IProfile } from "ui/components/Person";
interface IReturnedData {
  patient: (keyof IPatient)[];
  person: (keyof IPerson)[];
  profile: (keyof IProfile)[];
  addresses: (keyof IAddress)[];
  next_of_kins: (keyof INextOfKin)[];
}
const graphReturnedData: IReturnedData = {
  patient: ["_id", "patient_id", "person", "old_id"],
  person: ["_id", "person_id", "profile", "next_of_kins"],
  profile: [
    "last_name",
    "first_name",
    "middle_name",
    "gender",
    "dob",
    "phone_number",
    "addresses",
    "email",
    "occupation",
    "national_identity",
  ],
  addresses: ["_id", "street", "nstate", "town", "lga", "country"],
  next_of_kins: ["person_id", "relationship"],
};
export interface IPatientGraphQlActions {
  createPatient: (
    options: MutationFunctionOptions<{ patient: IPatient }, QTransferPatient>
  ) => Promise<FetchResult>;
  createPtWithPerson: (
    options: MutationFunctionOptions<
      { patient: IPatient },
      QTransferPtWithPerson
    >
  ) => Promise<FetchResult>;
  createPatientWithNok: (
    options: MutationFunctionOptions<{ patient: IPatient }, QTransferPtWithNok>
  ) => Promise<FetchResult>;
  createPatientWithMeta: (
    options: MutationFunctionOptions<{ patient: IPatient }, QTransferPtWithMeta>
  ) => Promise<FetchResult>;
  updatePatient: (
    options: MutationFunctionOptions<
      { patient: IPatient },
      QUpdatePtProfileTransfer
    >
  ) => Promise<FetchResult>;
  getPatients: LazyQueryExecFunction<
    {
      patients: IPatient[];
    },
    QPatientQueryParams
  >;
  patients?: IPatient[];
}
export function usePatient(): IPatientGraphQlActions {
  const [createPatient] = useMutation<{ patient: IPatient }, QTransferPatient>(
    graphCreatePatient(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses
    })
  );
  const [createPtWithPerson] = useMutation<
    { patient: IPatient },
    QTransferPtWithPerson
  >(
    graphCreatePtWithPerson(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses
    })
  );
  const [createPatientWithNok] = useMutation<
    { patient: IPatient },
    QTransferPtWithNok
  >(
    graphCreatePtWithNok(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses
    })
  );
  const [createPatientWithMeta] = useMutation<
    { patient: IPatient },
    QTransferPtWithMeta
  >(
    graphCreatePtWithMeta(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses
    })
  );
  const [getPatients] = useLazyQuery<
    { patients: IPatient[] },
    QPatientQueryParams
  >(
    graphGetPatients(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      addresses: graphReturnedData.addresses,
      next_of_kins: graphReturnedData.next_of_kins,
    }),
    {
      fetchPolicy: "network-only",
    }
  );
  const [updatePatient] = useMutation<
    { patient: IPatient },
    QUpdatePtProfileTransfer
  >(graphUpdatePatient(["_id"]));

  return {
    createPatient,
    createPtWithPerson,
    createPatientWithNok,
    createPatientWithMeta,
    getPatients,
    updatePatient,
  };
}
