import {
  FetchResult,
  LazyQueryExecFunction,
  MutationFunctionOptions,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  graphCreatePatient,
  graphCreatePatientMD,
  graphGetPatients,
  graphUpdatePatient,
} from "app/graph.queries/patients";
import {
  QPatientQueryParams,
  QTransferPatient,
  QTransferPatientMD,
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
  createPatientMD: (
    options: MutationFunctionOptions<{ patient: IPatient }, QTransferPatientMD>
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
    })
  );
  const [createPatientMD] = useMutation<
    { patient: IPatient },
    QTransferPatientMD
  >(
    graphCreatePatientMD(graphReturnedData.patient, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
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
    createPatientMD,
    getPatients,
    updatePatient,
  };
}
