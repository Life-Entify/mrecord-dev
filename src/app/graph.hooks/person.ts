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
export interface IPersonGraphQlActions {
  getPersons: LazyQueryExecFunction<{ persons: IPerson[] }, QPersonQueryParams>;
  getPersonsByID: LazyQueryExecFunction<
    { persons: IPerson[] },
    { _ids: string[] }
  >;
  createPerson: (
    options: MutationFunctionOptions<{ person: IPerson }, { profile: IProfile }>
  ) => Promise<FetchResult<{ person: IPerson }>>;
}
export function usePerson() {
  const [createPerson] = useMutation<
    { person: IPerson },
    { profile: IProfile }
  >(
    graphCreatePerson(graphReturnedData.person, {
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
    })
  );
  const [getPersons] = useLazyQuery<{ persons: IPerson[] }, QPersonQueryParams>(
    graphGetPersons(graphReturnedData.person, {
      profile: graphReturnedData.profile,
      addresses: graphReturnedData.addresses,
      next_of_kins: graphReturnedData.next_of_kins,
    })
  );
  const [getPersonsByID] = useLazyQuery<
    { persons: IPerson[] },
    { _ids: number[] }
  >(
    graphGetPersonsByID(graphReturnedData.person, {
      profile: graphReturnedData.profile,
      addresses: graphReturnedData.addresses,
      next_of_kins: graphReturnedData.next_of_kins,
    })
  );
  return {
    createPerson,
    getPersons,
    getPersonsByID,
  };
}
