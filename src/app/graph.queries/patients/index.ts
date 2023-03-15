import { gql } from "@apollo/client";
import { IPatient } from "ui/components/Patients/types";
import { IQueryArray, NestedPatientObject } from "./types";

function queryStringBuilder(
  query: (keyof IPatient)[] | IQueryArray,
  nestedValues?: NestedPatientObject
) {
  let queryString = "";
  for (let i = 0; i < query.length; i++) {
    const element = query[i];
    if (nestedValues?.[element as keyof NestedPatientObject]) {
      queryString += `${element} { ${queryStringBuilder(
        nestedValues[element as keyof NestedPatientObject] as IQueryArray,
        nestedValues
      )} }`;
    } else queryString += `${element} `;
  }
  return queryString;
}

export const graphUpdatePatient = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation updatePatient($_id: String, $patient: PatientInputType, $person_xid : String, $profile: ProfileInputType) {
        patient : updatePatient(_id: $_id, patient: $patient, person_xid : $person_xid, profile: $profile) {
            ${query}
        }
    }`;
};
export const graphCreatePatient = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation createPatient($oldId: String, $profile : ProfileInputType, $next_of_kins: [NextOfKinInputType]) {
        patient : createPatient(oldId: $oldId, profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreatePatientMD = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation createPatient($oldId: String, $person_id : String, $next_of_kins: [NextOfKinInputType]) {
        patient : createPatient(oldId: $oldId, person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphGetPatients = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    query getPatients($keyword: KeywordInputType, $limit: Int, $skip: Int) {
      patients: getPatients(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
