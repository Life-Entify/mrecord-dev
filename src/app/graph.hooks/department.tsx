import {
  FetchResult,
  LazyQueryExecFunction,
  MutationFunctionOptions,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  graphCreateDepartment,
  graphDeleteDepartment,
  graphGetDepartments,
  graphUpdateDepartment,
} from "app/graph.queries/departments";
import React from "react";
import { IDepartment } from "ui";
interface IReturnedData {
  department: (keyof IDepartment)[];
}
export interface IQDepartmentInput {
  department: Partial<IDepartment>;
}
export interface IQDepartmentRes {
  department: IDepartment;
}
export interface IDepartmentGraphQlActions {
  createDepartment: (
    options: MutationFunctionOptions<IQDepartmentRes, IQDepartmentInput>
  ) => Promise<FetchResult>;
  updateDepartment: (
    options: MutationFunctionOptions<
      IQDepartmentRes,
      { _id: string; department: Partial<IDepartment> }
    >
  ) => Promise<FetchResult>;
  getDepartments: LazyQueryExecFunction<
    {
      departments: IDepartment[];
    },
    IQDepartmentInput
  >;
  departments?: IDepartment[];
}
const graphReturnedData: IReturnedData = {
  department: ["_id", "description", "name", "app"],
};
export function useDepartment() {
  const [createDepartment] = useMutation<IQDepartmentRes, IQDepartmentInput>(
    graphCreateDepartment(graphReturnedData.department)
  );
  const [getDepartments] = useLazyQuery<
    { departments: IDepartment[] },
    IQDepartmentInput
  >(graphGetDepartments(graphReturnedData.department), {
    fetchPolicy: "network-only",
  });
  const [updateDepartment] = useMutation<
    IQDepartmentRes,
    { _id: string; department: Partial<IDepartment> }
  >(graphUpdateDepartment(["_id"]));
  const [deleteDepartment] = useMutation<{ _id: string }, { _id: string }>(
    graphDeleteDepartment()
  );

  return {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment,
  };
}
