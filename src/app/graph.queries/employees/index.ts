import { gql } from "@apollo/client";
import { IEmployee } from "ui";
import {
  IQueryArray,
  NestedPatientObject as NestedEmployeeObject,
} from "../patients/types";

function queryStringBuilder(
  query: (keyof IEmployee)[] | IQueryArray,
  nestedValues?: NestedEmployeeObject
) {
  let queryString = "";
  for (let i = 0; i < query.length; i++) {
    const element = query[i];
    if (nestedValues?.[element as keyof NestedEmployeeObject]) {
      queryString += `${element} { ${queryStringBuilder(
        nestedValues[element as keyof NestedEmployeeObject] as IQueryArray,
        nestedValues
      )} }`;
    } else queryString += `${element} `;
  }
  return queryString;
}

export const graphUpdateEmployee = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    mutation updateEmployee($_id: String, $Employee: EmployeeInputType, $person_xid : String, $profile: ProfileInputType) {
        Employee : updateEmployee(_id: $_id, Employee: $Employee, person_xid : $person_xid, profile: $profile) {
            ${query}
        }
    }`;
};
export const graphCreateEmployee = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    mutation createEmployee($profile : ProfileInputType, $next_of_kins: [NextOfKinInputType]) {
        employee : createEmployee(profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithPerson = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithPerson($person_id : Int, $next_of_kins: [NextOfKinInputType]) {
        employee : createEmployeeWithPerson(person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithNok = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithNok($profile : ProfileInputType, $next_of_kins: [NextOfKinMetaInputType]) {
        employee : createEmployeeWithNok(profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithMeta = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithMD($person_id : Int, $next_of_kins: [NextOfKinMetaInputType]) {
        employee : createEmployeeWithMD(person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphGetEmployees = (
  Employee?: (keyof IEmployee)[],
  nestedValues?: NestedEmployeeObject
) => {
  const query = Employee ? queryStringBuilder(Employee, nestedValues) : "_id";
  return gql`
    query getEmployees($keyword: EmpKeywordInputType, $limit: Int, $skip: Int) {
      employees: getEmployees(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
