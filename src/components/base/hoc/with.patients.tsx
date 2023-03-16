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
  graphGetPatients,
  graphUpdatePatient,
} from "app/graph.queries/patients";
import {
  QPatientQueryParams,
  QTransferPatient,
  QTransferPtWithPerson,
  QUpdatePtProfileTransfer,
} from "app/graph.queries/patients/types";
import {
  graphCreatePerson,
  graphGetPersons,
  graphGetPersonsByID,
} from "app/graph.queries/persons";
import {
  QDataPerson,
  QPersonQueryParams,
} from "app/graph.queries/persons/types";
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
export interface IWithPatientProps {
  getPersons: LazyQueryExecFunction<{ persons: IPerson[] }, QPersonQueryParams>;
  getPersonsByID: LazyQueryExecFunction<
    { persons: IPerson[] },
    { _ids: string[] }
  >;
  createPerson: (
    options: MutationFunctionOptions<{ person: IPerson }, { profile: IProfile }>
  ) => Promise<FetchResult<{ person: IPerson }>>;
  createPatient: (
    options: MutationFunctionOptions<{ patient: IPatient }, QTransferPatient>
  ) => Promise<FetchResult>;
  createPtWithPerson: (
    options: MutationFunctionOptions<
      { patient: IPatient },
      QTransferPtWithPerson
    >
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
    const [createPtWithPerson] = useMutation(
      graphCreatePtWithPerson(graphReturnedData.patient, {
        person: graphReturnedData.person,
        profile: graphReturnedData.profile,
      })
    );
    const [getPatients, { data: ptData }] = useLazyQuery<
      { patients: IPatient[] },
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
      { patient: IPatient },
      QUpdatePtProfileTransfer
    >(graphUpdatePatient(["_id"]));

    const [createPerson] = useMutation<IPerson, QDataPerson>(
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
        createPtWithPerson={createPtWithPerson}
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
