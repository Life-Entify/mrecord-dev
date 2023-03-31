import { gql } from "@apollo/client";
import { IEmployee } from "ui";
import { IEmployeeNestedQueryObject, IEmployeeQueryArray } from "./types";

function queryStringBuilder(
  query: (keyof IEmployee)[] | IEmployeeQueryArray,
  nestedValues?: IEmployeeNestedQueryObject
) {
  let queryString = "";
  for (let i = 0; i < query.length; i++) {
    const element = query[i];
    if (nestedValues?.[element as keyof IEmployeeNestedQueryObject]) {
      queryString += `${element} { ${queryStringBuilder(
        nestedValues[
          element as keyof IEmployeeNestedQueryObject
        ] as IEmployeeQueryArray,
        nestedValues
      )} }`;
    } else queryString += `${element} `;
  }
  return queryString;
}

export const graphAddEmpDepartment = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation addEmpDepartment($_id: String, $department_id: String, $login: LoginInputType) {
        employee : addEmpDepartment(_id: $_id, department_id: $department_id, login: $login ) {
          ${query}
        }
    }`;
};
export const graphDeleteEmpDepartment = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation deleteEmpDepartment($_id: String, $department_id: String) {
        employee : deleteEmpDepartment(_id: $_id, department_id: $department_id ) {
          ${query}
        }
    }`;
};
export const graphUpdateEmployee = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation updateEmployee($_id: String, $employee: EmployeeInputType, $person_xid : String, $profile: ProfileInputType) {
        employee : updateEmployee(_id: $_id, employee: $employee, person_xid : $person_xid, profile: $profile) {
          ${query}
        }
    }`;
};
export const graphCreateEmployee = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation createEmployee($profile : ProfileInputType, $next_of_kins: [NextOfKinInputType]) {
        employee : createEmployee(profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithPerson = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithPerson($person_id : Int, $next_of_kins: [NextOfKinInputType]) {
        employee : createEmployeeWithPerson(person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithNok = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithNok($profile : ProfileInputType, $next_of_kins: [NextOfKinMetaInputType]) {
        employee : createEmployeeWithNok(profile : $profile, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphCreateEmpWithMeta = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    mutation createEmployeeWithMD($person_id : Int, $next_of_kins: [NextOfKinMetaInputType]) {
        employee : createEmployeeWithMD(person_id : $person_id, next_of_kins: $next_of_kins) {
            ${query}
        }
    }`;
};
export const graphGetEmployees = (
  employee?: (keyof IEmployee)[],
  nestedValues?: IEmployeeNestedQueryObject
) => {
  const query = employee ? queryStringBuilder(employee, nestedValues) : "_id";
  return gql`
    query getEmployees($keyword: EmpKeywordInputType, $limit: Int, $skip: Int) {
      employees: getEmployees(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
