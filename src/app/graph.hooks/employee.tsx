import { useLazyQuery, useMutation } from "@apollo/client";
import {
  graphCreateEmployee,
  graphCreateEmpWithPerson,
  graphCreateEmpWithNok,
  graphCreateEmpWithMeta,
  graphGetEmployees,
  graphUpdateEmployee,
  graphDeleteEmpDepartment,
  graphAddEmpDepartment,
  graphGetEmployeesByEmployeeId,
} from "app/graph.queries/employees";
import {
  IEmployeeQueryReturnData,
  QEmployeeQueryParams,
  QTransferEmployee,
  QTransferEmpWithMeta,
  QTransferEmpWithNok,
  QTransferEmpWithPerson,
  QUpdateEmpProfileTransfer,
} from "app/graph.queries/employees/types";
import React from "react";
import { IEmployee, ILogin } from "ui";
const defaultReturnData: IEmployeeQueryReturnData = {
  employee: [
    "_id",
    "employee_id",
    "person",
    "department_ids",
    "status",
    "logins",
  ],
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
  logins: ["department_id", "password", "username"],
};

export function useEmployee(
  employeeReturnData: IEmployeeQueryReturnData = defaultReturnData
) {
  const [addEmpDepartment] = useMutation<
    { employee: IEmployee },
    { _id: string; department_id: string; login?: ILogin }
  >(
    graphAddEmpDepartment(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [deleteEmpDepartment] = useMutation<
    { employee: IEmployee },
    { _id: string; department_id: string }
  >(
    graphDeleteEmpDepartment(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [createEmployee] = useMutation<
    { employee: IEmployee },
    QTransferEmployee
  >(
    graphCreateEmployee(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [createEmpWithPerson] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithPerson
  >(
    graphCreateEmpWithPerson(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [createEmployeeWithNok] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithNok
  >(
    graphCreateEmpWithNok(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [createEmployeeWithMeta] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithMeta
  >(
    graphCreateEmpWithMeta(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      next_of_kins: employeeReturnData.next_of_kins,
      addresses: employeeReturnData.addresses,
      logins: employeeReturnData.logins,
    })
  );
  const [getEmployeesByEmployeeId] = useLazyQuery<
    { employees: IEmployee[] },
    { ids: number[] }
  >(
    graphGetEmployeesByEmployeeId(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      addresses: employeeReturnData.addresses,
      next_of_kins: employeeReturnData.next_of_kins,
      logins: employeeReturnData.logins,
    }),
    {
      fetchPolicy: "no-cache",
      nextFetchPolicy(currentFetchPolicy, context) {
        return "network-only";
      },
    }
  );
  const [getEmployees] = useLazyQuery<
    { employees: IEmployee[] },
    QEmployeeQueryParams
  >(
    graphGetEmployees(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      addresses: employeeReturnData.addresses,
      next_of_kins: employeeReturnData.next_of_kins,
      logins: employeeReturnData.logins,
    }),
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateEmployee] = useMutation<
    { employee: IEmployee },
    QUpdateEmpProfileTransfer
  >(
    graphUpdateEmployee(employeeReturnData.employee, {
      person: employeeReturnData.person,
      profile: employeeReturnData.profile,
      addresses: employeeReturnData.addresses,
      next_of_kins: employeeReturnData.next_of_kins,
      logins: employeeReturnData.logins,
    })
  );

  return {
    addEmpDepartment,
    deleteEmpDepartment,
    createEmployee,
    createEmpWithPerson,
    createEmployeeWithNok,
    createEmployeeWithMeta,
    getEmployees,
    getEmployeesByEmployeeId,
    updateEmployee,
  };
}
