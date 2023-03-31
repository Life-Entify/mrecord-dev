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
const graphReturnedData: IEmployeeQueryReturnData = {
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

export function useEmployee() {
  const [addEmpDepartment] = useMutation<
    { employee: IEmployee },
    { _id: string; department_id: string; login?: ILogin }
  >(
    graphAddEmpDepartment(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [deleteEmpDepartment] = useMutation<
    { employee: IEmployee },
    { _id: string; department_id: string }
  >(
    graphDeleteEmpDepartment(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [createEmployee] = useMutation<
    { employee: IEmployee },
    QTransferEmployee
  >(
    graphCreateEmployee(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [createEmpWithPerson] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithPerson
  >(
    graphCreateEmpWithPerson(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [createEmployeeWithNok] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithNok
  >(
    graphCreateEmpWithNok(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [createEmployeeWithMeta] = useMutation<
    { employee: IEmployee },
    QTransferEmpWithMeta
  >(
    graphCreateEmpWithMeta(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
      logins: graphReturnedData.logins,
    })
  );
  const [getEmployees] = useLazyQuery<
    { employees: IEmployee[] },
    QEmployeeQueryParams
  >(
    graphGetEmployees(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      addresses: graphReturnedData.addresses,
      next_of_kins: graphReturnedData.next_of_kins,
      logins: graphReturnedData.logins,
    }),
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateEmployee] = useMutation<
    { employee: IEmployee },
    QUpdateEmpProfileTransfer
  >(
    graphUpdateEmployee(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      addresses: graphReturnedData.addresses,
      next_of_kins: graphReturnedData.next_of_kins,
      logins: graphReturnedData.logins,
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
    updateEmployee,
  };
}
