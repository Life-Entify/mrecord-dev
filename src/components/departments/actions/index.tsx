import { useDepartment } from "app/graph.hooks/department";
import { selectDepartment, setDepartments } from "app/redux/dept.core";
import { useAppDispatch } from "app/redux/hook";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppError, IDepartment, INotify } from "ui";
export interface IActionOptions {
  notify: INotify;
}
export function useDepartmentAction() {
  const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartment();
  const departments = useSelector(selectDepartment);
  const dispatch = useAppDispatch();
  const [department, setDepartment] = useState<IDepartment>();
  const getDept = async (noise?: boolean, options?: { notify: INotify }) => {
    try {
      const { data } = await getDepartments({});
      const { departments } = data || {};
      dispatch(setDepartments(departments as IDepartment[]));
      noise &&
        options?.notify?.("success", {
          key: "get-dept-success",
          message: "Success",
          description: "Fetched departments",
        });
    } catch (e) {
      options?.notify?.("error", {
        key: "get-dept-error",
        message: "Error",
        description: (e as Error).message,
      });
    }
  };
  const deleteDept = useCallback(
    async (deptId?: string, options?: IActionOptions) => {
      if (!deptId) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No Department ID found!",
        });
      }
      try {
        await deleteDepartment({
          variables: { _id: deptId },
        });
        await getDept(false, options);
        options?.notify?.("success", {
          key: "delete-dept-success",
          message: "Success",
          description: "Department deleted",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateDepartment, JSON.stringify(department)]
  );
  const updateDept = useCallback(
    async (dept: Partial<IDepartment>, options?: IActionOptions) => {
      if (
        dept.name === department?.name &&
        dept.description === department?.description
      ) {
        return options?.notify?.("error", {
          key: "error-no-changes",
          message: "Error",
          description: "No changes made",
        });
      }
      try {
        await updateDepartment({
          variables: { department: dept, _id: department?._id as string },
        });
        await getDept(false, options);
        options?.notify?.("success", {
          key: "update-dept-success",
          message: "Success",
          description: "Department updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-throw-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateDepartment, JSON.stringify(department)]
  );
  const createDept = useCallback(
    async (department: Partial<IDepartment>, options: IActionOptions) => {
      if (!department.name) {
        return options?.notify?.("error", {
          key: "create-dept-error",
          message: "Error",
          description: "Missing name field",
        });
      }
      try {
        await createDepartment({
          variables: { department },
        });
        await getDept(false, { notify: options.notify });
        return options?.notify?.("success", {
          key: "create-dept-success",
          message: "Success",
          description: "Department created!",
        });
      } catch (e) {
        return options?.notify?.("error", {
          key: "create-dept-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!createDepartment]
  );
  useEffect(() => {
    getDept();
  }, []);

  return {
    departments,
    department,
    setDepartment,
    getDepartments: getDept,
    createDepartment: createDept,
    updateDepartment: updateDept,
    deleteDepartment: deleteDept,
  };
}
