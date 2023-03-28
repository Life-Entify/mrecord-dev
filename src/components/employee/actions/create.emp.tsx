import { useEmployee } from "app/graph.hooks/employee";
import { usePerson } from "app/graph.hooks/person";
import { QTransferEmployee } from "app/graph.queries/employees/types";
import { AppError } from "ui";
import { IFormEmployee } from "ui/components/Employees/types";
import { INewPersonData, personFormRefactor } from "ui/components/Person";
import React, { useState } from "react";

export const useCreateEmployeeAction = () => {
  const { getPersons } = usePerson();
  const { getEmployees, createEmployee } = useEmployee();
  const [processing, setProcessing] = useState<boolean>();

  const createEmp = async (info: INewPersonData<IFormEmployee>) => {
    setProcessing(true);
    const { profile, next_of_kins } = info;
    const cNextOfKins = next_of_kins.map((nextOfKin) => {
      return personFormRefactor(nextOfKin);
    });
    const cProfile = personFormRefactor(profile as IFormEmployee);
    if (
      cProfile.profile.phone_number === cNextOfKins?.[0]?.profile?.phone_number
    ) {
      throw new AppError(
        "Phone numbers for employee and next of kin can't be the same",
        {
          cause: {
            code: 0,
            label: "Same Phone Number",
          },
        }
      );
    }
    const employee: QTransferEmployee = {
      oldId: cProfile.oldId as string,
      profile: cProfile.profile,
      next_of_kins: cNextOfKins.map((i) => ({
        next_of_kin: i.profile,
        relationship: i.relationship as string,
      })),
    };
    const { data: empWithSameNationalID } = await getEmployees({
      variables: {
        keyword: {
          person: {
            profile: {
              national_identity: employee.profile.national_identity,
            },
          },
        },
        // patien employee.profile.national_identity,
      },
    });
    if (
      empWithSameNationalID?.employees &&
      empWithSameNationalID.employees.length > 0
    ) {
      throw new AppError(
        `Employee with national ID ${employee.profile.national_identity} already exists`,
        {
          cause: {
            code: 0,
            label: "Employee Already Exists!",
          },
        }
      );
    }
    const { data: empWithSamePhoneNumber } = await getEmployees({
      variables: {
        keyword: {
          person: {
            profile: {
              phone_number: employee.profile.phone_number,
            },
          },
        },
      },
    });
    if (
      empWithSamePhoneNumber?.employees &&
      empWithSamePhoneNumber.employees.length > 0
    ) {
      throw new AppError(
        `Employee with phone number ${employee.profile.phone_number} already exist`,
        {
          cause: {
            code: 0,
            label: "Employee Already Exists!",
          },
        }
      );
    }

    // checking for person to convert to employee, but has the same phone number
    const { data: dataPersons, error } = await getPersons({
      variables: {
        keyword: {
          profile: {
            phone_number: employee.profile.phone_number,
          },
        },
        limit: 1,
      },
    });
    const { persons: personsWithPhone } = dataPersons || {};
    if (error || personsWithPhone?.[0]) {
      throw new AppError(
        error?.message ||
          `Person with phone number ${employee.profile.phone_number} already exists`,
        {
          cause: {
            code: error ? 0 : 1,
            label: "Existing Phone Number",
            data: personsWithPhone?.[0],
          },
        }
      );
    }
    // no need searching person with national identity as this will be covered with find employee
    // as next of kin person doesn't record the national identity
    const nokPhone = employee.next_of_kins?.[0]?.next_of_kin.phone_number;
    if (!nokPhone) {
      throw new AppError(`Next of kin phone number missing`, {
        cause: {
          code: 0,
          label: "Next of Kin Profile Error",
        },
      });
    }

    const { data: nokData, error: pError } = await getPersons({
      variables: {
        keyword: {
          profile: {
            phone_number: nokPhone,
          },
        },
      },
    });
    const { persons: nokPerson } = nokData || {};
    if (pError || nokPerson?.[0]) {
      throw new AppError(
        pError?.message ||
          `Next of kin with phone number ${nokPhone}, do you want to use him/her instead?`,
        {
          cause: {
            code: pError ? 0 : 2,
            label: "Existing Next of kin",
            data: nokPerson?.[0],
          },
        }
      );
    }
    const inputData = {
      profile: employee.profile,
      next_of_kins: employee.next_of_kins,
    };
    const { data: empData } = await createEmployee({
      variables: inputData,
    });
    setProcessing(false);
    return empData?.employee;
  };

  return { createEmployee: createEmp, processing };
};
