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
    mutation createPatient($old_id: String, $profile : ProfileInputType, $next_of_kins: [NextOfKinInputType]) {
        patient : createPatient(old_id: $old_id, profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreatePtWithPerson = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation createPatientWithPerson($old_id: String, $person_id : Int, $next_of_kins: [NextOfKinInputType]) {
        patient : createPatientWithPerson(old_id: $old_id, person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreatePtWithNok = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation createPatientWithNok($old_id: String,  $profile : ProfileInputType, $next_of_kins: [NextOfKinMetaInputType]) {
        patient : createPatientWithNok(old_id: $old_id, profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreatePtWithMeta = (
  patient?: (keyof IPatient)[],
  nestedValues?: NestedPatientObject
) => {
  const query = patient ? queryStringBuilder(patient, nestedValues) : "_id";
  return gql`
    mutation createPatientWithMD($old_id: String, $person_id : Int, $next_of_kins: [NextOfKinMetaInputType]) {
        patient : createPatientWithMD(old_id: $old_id, person_id : $person_id, next_of_kins: $next_of_kins) {
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
