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
  QNextOfKin,
  QPatient,
  QPatientQueryParams,
  QTransferPatient,
  QTransferPatientMD,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import {
  graphCreatePerson,
  graphGetPersons,
  graphGetPersonsByID,
} from "app/graph.queries/persons";
import {
  QAddress,
  QDataPerson,
  QPerson,
  QPersonQueryParams,
  QProfile,
} from "app/graph.queries/persons/types";
import React from "react";
interface IReturnedData {
  patient: (keyof QPatient)[];
  person: (keyof QPerson)[];
  profile: (keyof QProfile)[];
  addresses: (keyof QAddress)[];
  next_of_kins: (keyof QNextOfKin)[];
}
const graphReturnedData: IReturnedData = {
  patient: ["_id", "patient_id", "person", "old_id", "next_of_kins"],
  person: ["_id", "person_id", "profile"],
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
export interface IWithPatientProps {
  getPersons: LazyQueryExecFunction<{ persons: QPerson[] }, QPersonQueryParams>;
  getPersonsByID: LazyQueryExecFunction<
    { persons: QPerson[] },
    { _ids: string[] }
  >;
  createPerson: (
    options: MutationFunctionOptions<{ person: QPerson }, { profile: QProfile }>
  ) => Promise<FetchResult<{ person: QPerson }>>;
  createPatient: (
    options: MutationFunctionOptions<{ patient: QPatient }, QTransferPatient>
  ) => Promise<FetchResult>;
  createPatientMD: (
    options: MutationFunctionOptions<{ patient: QPatient }, QTransferPatientMD>
  ) => Promise<FetchResult>;
  updatePatient: (
    options: MutationFunctionOptions<
      { patient: QPatient },
      QUpdatePtProfileTransfer
    >
  ) => Promise<FetchResult>;
  getPatients: LazyQueryExecFunction<
    {
      patients: QPatient[];
    },
    QPatientQueryParams
  >;
  patients?: QPatient[];
}
export function WithPatient<T extends IWithPatientProps>(
  ChildComponent: React.ComponentType<T>
) {
  const WrappedComponent = (props: T) => {
    const [savePatient] = useMutation(
      graphCreatePatient(graphReturnedData.patient, {
        person: graphReturnedData.person,
        profile: graphReturnedData.profile,
      })
    );
    const [createPatientMD] = useMutation(
      graphCreatePatientMD(graphReturnedData.patient, {
        person: graphReturnedData.person,
        profile: graphReturnedData.profile,
      })
    );
    const [getPatients, { data: ptData }] = useLazyQuery<
      { patients: QPatient[] },
      QPatientQueryParams
    >(
      graphGetPatients(graphReturnedData.patient, {
        person: graphReturnedData.person,
        profile: graphReturnedData.profile,
        addresses: graphReturnedData.addresses,
        next_of_kins: graphReturnedData.next_of_kins,
      })
    );
    const [updatePatient] = useMutation<
      { patient: QPatient },
      QUpdatePtProfileTransfer
    >(graphUpdatePatient(["_id"]));

    const [createPerson] = useMutation<QPerson, QDataPerson>(
      graphCreatePerson(graphReturnedData.person, {
        profile: graphReturnedData.profile,
      })
    );
    const [getPersons] = useLazyQuery<
      { persons: QDataPerson[] },
      QPersonQueryParams
    >(
      graphGetPersons(graphReturnedData.person, {
        profile: graphReturnedData.profile,
        addresses: graphReturnedData.addresses,
      })
    );
    const [getPersonsByID] = useLazyQuery<
      { persons: QDataPerson[] },
      QPersonQueryParams
    >(
      graphGetPersonsByID(graphReturnedData.person, {
        profile: graphReturnedData.profile,
        addresses: graphReturnedData.addresses,
      })
    );
    return (
      <ChildComponent
        {...props}
        createPatient={savePatient}
        createPatientMD={createPatientMD}
        createPerson={createPerson}
        getPatients={getPatients}
        getPersons={getPersons}
        getPersonsByID={getPersonsByID}
        patients={ptData?.patients}
        updatePatient={updatePatient}
      />
    );
  };
  return WrappedComponent;
}
