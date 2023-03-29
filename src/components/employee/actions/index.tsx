import { useEmployee } from "app/graph.hooks/employee";
import { usePerson } from "app/graph.hooks/person";
import {
  QEmployeeQueryParams,
  QUpdateEmpProfileTransfer,
} from "app/graph.queries/employees/types";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppError,
  ILogin,
  INotificationTypes,
  INotify,
  INotifyObjectProps,
} from "ui";
import { IFormEmployee, IEmployee } from "ui";
import {
  formToPerson,
  IFamilyMemberDetails,
  INewPersonData,
  INextOfKin,
  INextOfKinDetails,
  IPerson,
} from "ui/components/Person";
import { createErrorHandler } from "./create.error.handler";
import { useCreateEmployeeAction } from "./create.emp";
import { useCreateEmployeeWithMeta } from "./create.emp.wt.meta";
import { useCreateEmployeeWithNok } from "./create.emp.wt.nok";
import { useCreateEmployeeWithPerson } from "./create.emp.wt.person";
import { QNextOfKins } from "app/graph.queries/patients/types";
export interface IExistingPersonState {
  person: IPerson;
  who: "next_of_kin" | "employee";
}

export const useEmployeeActions = () => {
  const {
    getEmployees,
    updateEmployee,
    addEmpDepartment,
    deleteEmpDepartment,
  } = useEmployee();
  const { createEmployee } = useCreateEmployeeAction();
  const { createEmpWithPerson } = useCreateEmployeeWithPerson();
  const { createEmployeeWithNok } = useCreateEmployeeWithNok();
  const { createEmployeeWithMeta } = useCreateEmployeeWithMeta();
  const { getPersonsByID } = usePerson();
  const [empQueryParams, setEmpQueryParams] = useState<QEmployeeQueryParams>({
    skip: 0,
    limit: 100,
  });
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [employee, setEmployee] = useState<IEmployee>();
  const [family, setFamily] = useState<{
    nextOfKins?: INextOfKinDetails[];
    members?: IFamilyMemberDetails[];
  }>();
  const [newEmpFormData, setNewEmpFormData] =
    useState<INewPersonData<IFormEmployee>>();
  const [existingPerson, setExistingPerson] = useState<IExistingPersonState>();
  const [employeeData, setEmpData] = useState<INewPersonData<IFormEmployee>>();

  const setEmployeeAndGetFamily = (
    record: IEmployee,
    getFamily: boolean,
    notify: INotify
  ) => {
    setEmployee(record);
    if (!getFamily) return;
    const { next_of_kins } = record?.person || {};
    if (next_of_kins && next_of_kins.length > 0) {
      getPersonsByID({
        variables: {
          _ids: next_of_kins?.map((nok) => nok.person_id),
        },
      }).then(
        ({ data }) => {
          if (data?.persons && data.persons.length > 0) {
            const noksCollection: INextOfKinDetails[] = [];
            const { persons } = data;
            for (let i = 0; i < next_of_kins.length; i++) {
              const nok = next_of_kins[i];
              const p = persons?.find((p) => p.person_id === nok.person_id);
              if (p)
                noksCollection.push({
                  next_of_kin: p,
                  relationship: nok.relationship,
                });
            }
            setFamily({ nextOfKins: noksCollection });
          }
        },
        (cause) => {
          notify("error", {
            key: "notification-can-not-get-family-nok",
            message: "Get Family Error",
            description: cause as React.ReactNode,
          });
        }
      );
    }
  };
  const updateEmp = useCallback(
    async (emp: Partial<IEmployee>, options?: { notify: INotify }) => {
      try {
        if (!employee) {
          options?.notify?.("error", {
            key: "nil-emp-error",
            message: "Error",
            description: "Nil Employee",
          });
        }
        const { data } = await updateEmployee({
          variables: {
            _id: employee?._id as string,
            employee: emp,
          },
        });
        const newEmp = data?.employee;
        setEmployee(newEmp);
        options?.notify?.("success", {
          key: "update-emp-success",
          message: "Success",
          description: "Employee status updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-emp-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateEmployee, JSON.stringify(employee)]
  );
  const deleteEmpDept = useCallback(
    async (deptId: string, options?: { notify: INotify }) => {
      try {
        if (!employee) {
          options?.notify?.("error", {
            key: "nil-emp-error",
            message: "Error",
            description: "Nil Employee",
          });
        }
        const { data } = await deleteEmpDepartment({
          variables: {
            _id: employee?._id as string,
            department_id: deptId,
          },
        });
        const newEmp = data?.employee;
        setEmployee(newEmp);
        options?.notify?.("success", {
          key: "delete-emp-dept-success",
          message: "Success",
          description: "Employee status updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "delete-emp-dept-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateEmployee, JSON.stringify(employee)]
  );
  const addEmpDept = useCallback(
    async (deptId: string, login?: ILogin, options?: { notify: INotify }) => {
      try {
        if (!employee) {
          options?.notify?.("error", {
            key: "nil-emp-error",
            message: "Error",
            description: "Nil Employee",
          });
        }
        const { data } = await addEmpDepartment({
          variables: {
            _id: employee?._id as string,
            department_id: deptId,
            login,
          },
        });
        const newEmp = data?.employee;
        setEmployee(newEmp);
        options?.notify?.("success", {
          key: "update-emp-success",
          message: "Success",
          description: "Employee status updated",
        });
      } catch (e) {
        options?.notify?.("error", {
          key: "update-emp-error",
          message: "Error",
          description: (e as Error).message,
        });
      }
    },
    [!!updateEmployee, JSON.stringify(employee)]
  );
  const updateProfile = useCallback(
    async (
      formEmployee: Partial<IFormEmployee>,
      notify: (type: INotificationTypes, props: INotifyObjectProps) => void
    ) => {
      const { ...profile } = formEmployee || {};
      const updateData: QUpdateEmpProfileTransfer = {};
      // if (old_id) {
      //   updateData._id = employee?._id;
      //   updateData.employee = { old_id };
      // }
      if (
        JSON.stringify(employee?.person?.profile) !== JSON.stringify(profile)
      ) {
        updateData.person_xid = employee?.person?._id;
        updateData.profile = formToPerson(
          employee?.person?.profile?.addresses?.[0]?._id || "address1",
          profile as IFormEmployee
        );
      }
      await updateEmployee({
        variables: updateData,
      });
      const { data: empData } = await getEmployees({
        variables: empQueryParams,
      });
      setEmployees(empData?.employees);
      const emp = empData?.employees?.find(
        (item) => item._id === employee?._id
      );
      if (emp) {
        setEmployee(emp);
      }
      notify("success", {
        message: "Successful Update",
        description: "Profile updated successfully",
        key: "update-profile-success",
      });
    },
    [JSON.stringify(employee)]
  );
  const getEmps = useCallback(async () => {
    const { data } = await getEmployees();
    const employees = data?.employees;
    setEmployees(employees);
  }, [!!getEmployees]);

  const createEmp = async (
    info: INewPersonData<IFormEmployee>,
    {
      notify,
      onViewExistingPerson,
      onClose,
    }: {
      notify: INotify;
      onViewExistingPerson?: () => void;
      onClose: () => void;
    }
  ) => {
    try {
      const newEmp = await createEmployee(structuredClone(info));
      await getEmps();
      notify("success", {
        key: "create-emp-success",
        message: "Employee created!",
        description: `employee with Employee ID ${newEmp?.employee_id} created!`,
      });
    } catch (e) {
      const error = e as AppError<IPerson>;
      if (error.cause?.code !== 0) {
        setNewEmpFormData(info);
      }
      createErrorHandler(structuredClone(info), error, {
        setExistingPerson,
        onClose,
        onViewExistingPerson,
        notify,
      });
      throw e;
    }
  };
  const createEmpWPerson = useCallback(
    async (
      person: IPerson,
      {
        notify,
        onViewExistingPerson,
      }: {
        notify: (type: INotificationTypes, props: INotifyObjectProps) => void;
        onViewExistingPerson?: () => void;
      }
    ) => {
      const updatedInfo = {
        person_id: person.person_id,
        next_of_kins: newEmpFormData?.next_of_kins as QNextOfKins[],
      };
      try {
        const newEmp = await createEmpWithPerson(updatedInfo);
        await getEmps();
        notify("success", {
          key: "create-emp-success",
          message: "Employee created!",
          description: `employee with Employee ID ${newEmp?.employee_id} created!`,
        });
      } catch (e) {
        const error = e as AppError<IPerson>;
        if (error.cause?.code === 2) {
          setEmpData(updatedInfo);
        }
        createErrorHandler(
          newEmpFormData as INewPersonData<IFormEmployee>,
          error,
          {
            setExistingPerson,
            notify,
            onViewExistingPerson,
          }
        );
        throw error;
      }
    },
    [JSON.stringify(newEmpFormData)]
  );
  const createEmpWNok = useCallback(
    async (person: IPerson, { notify }: { notify: INotify }) => {
      try {
        if (employeeData?.person_id) {
          // run meta
          const newEmp = await createEmployeeWithMeta({
            person_id: employeeData?.person_id,
            next_of_kins: [
              {
                relationship: newEmpFormData?.next_of_kins?.[0].relationship,
                person_id: person?.person_id,
              } as INextOfKin,
            ],
          });
          await getEmps();
          notify("success", {
            key: "create-emp-success",
            message: "Employee created!",
            description: `employee with Employee ID ${newEmp?.employee_id} created!`,
          });
        } else {
          const newEmp = await createEmployeeWithNok({
            profile: newEmpFormData?.profile as IFormEmployee,
            next_of_kins: [
              {
                relationship: newEmpFormData?.next_of_kins?.[0].relationship,
                person_id: person?.person_id,
              } as INextOfKin,
            ],
          });
          const { data: updatedEmpData } = await getEmployees({});
          const newEmps = updatedEmpData?.employees;
          setEmployees(newEmps);
          notify("success", {
            key: "create-emp-success",
            message: "Employee created!",
            description: `employee with Employee ID ${newEmp?.employee_id} created!`,
          });
        }
      } catch (e) {
        notify("error", {
          key: "create-emp-nok-error",
          message: "Create Employee Error",
          description: (e as Error).message,
        });
      }
    },
    [JSON.stringify(employeeData), JSON.stringify(newEmpFormData)]
  );
  useEffect(() => {
    getEmployees({
      variables: empQueryParams,
    });
  }, [JSON.stringify(empQueryParams)]);
  useEffect(() => {
    (async () => {
      const { data } = await getEmployees({
        variables: empQueryParams,
      });
      setEmployees(data?.employees);
    })();
  }, []);
  return {
    employees,
    employee,
    family,
    existingPerson,
    newEmpFormData,
    updateEmployee: updateEmp,
    deleteEmpDepartment: deleteEmpDept,
    addEmpDepartment: addEmpDept,
    setEmployee: setEmployeeAndGetFamily,
    updateProfile,
    createEmployee: createEmp,
    createEmpWithPerson: createEmpWPerson,
    createEmpWithNok: createEmpWNok,
  };
};
