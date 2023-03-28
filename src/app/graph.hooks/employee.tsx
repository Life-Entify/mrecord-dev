import {
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import {
  graphCreateEmployee,
  graphCreateEmpWithPerson,
  graphCreateEmpWithNok,
  graphCreateEmpWithMeta,
  graphGetEmployees,
  graphUpdateEmployee,
} from "app/graph.queries/employees";
import {
  QEmployeeQueryParams,
  QTransferEmployee,
  QTransferEmpWithMeta,
  QTransferEmpWithNok,
  QTransferEmpWithPerson,
  QUpdateEmpProfileTransfer,
} from "app/graph.queries/employees/types";
import React from "react";
import { IEmployee } from "ui";
import { IAddress, INextOfKin, IPerson, IProfile } from "ui/components/Person";
interface IReturnedData {
  employee: (keyof IEmployee)[];
  person: (keyof IPerson)[];
  profile: (keyof IProfile)[];
  addresses: (keyof IAddress)[];
  next_of_kins: (keyof INextOfKin)[];
}
const graphReturnedData: IReturnedData = {
  employee: ["_id", "employee_id", "person"],
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
};

export function useEmployee() {
  const [createEmployee] = useMutation<{ employee: IEmployee }, QTransferEmployee>(
    graphCreateEmployee(graphReturnedData.employee, {
      person: graphReturnedData.person,
      profile: graphReturnedData.profile,
      next_of_kins: graphReturnedData.next_of_kins,
      addresses: graphReturnedData.addresses,
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
    }),
    {
      fetchPolicy: "network-only",
    }
  );
  const [updateEmployee] = useMutation<
    { employee: IEmployee },
    QUpdateEmpProfileTransfer
  >(graphUpdateEmployee(["_id"]));

  return {
    createEmployee,
    createEmpWithPerson,
    createEmployeeWithNok,
    createEmployeeWithMeta,
    getEmployees,
    updateEmployee,
  };
}
