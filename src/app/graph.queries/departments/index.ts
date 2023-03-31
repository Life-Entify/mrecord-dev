import { gql } from "@apollo/client";
import { IDepartment } from "ui";

export const graphDeleteDepartment = () => {
  return gql`
    mutation deleteDepartment($_id: String) {
      _id: deleteDepartment(_id: $_id) {
        _id
      }
    }
  `;
};
export const graphUpdateDepartment = (department?: (keyof IDepartment)[]) => {
  const query = department ? department.join(" ") : "_id";
  return gql`
    mutation updateDepartment($_id: String, $department: DepartmentInputType) {
        department : updateDepartment(_id: $_id, department: $department) {
            ${query}
        }
    }`;
};
export const graphCreateDepartment = (department?: (keyof IDepartment)[]) => {
  const query = department ? department.join(" ") : "_id";
  return gql`
    mutation createDepartment($department : DepartmentInputType) {
      department : createDepartment(department : $department) {
            ${query}
        }
    }`;
};
export const graphGetDepartments = (department?: (keyof IDepartment)[]) => {
  const query = department ? department.join(" ") : "_id";
  return gql`
    query getDepartments($keyword: DepartmentInputType, $limit: Int, $skip: Int) {
      departments: getDepartments(keyword: $keyword, limit: $limit, skip: $skip) {
        ${query}
      }
    }
  `;
};
