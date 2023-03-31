import { useEmployee } from "app/graph.hooks/employee";
import { usePerson } from "app/graph.hooks/person";
import { QTransferEmpWithPerson } from "app/graph.queries/employees/types";
import { QNextOfKins } from "app/graph.queries/patients/types";
import { useState } from "react";
import { AppError } from "ui";
import { personFormRefactor } from "ui/components/Person";
export function useCreateEmployeeWithPerson() {
  const { getPersons } = usePerson();
  const { createEmpWithPerson } = useEmployee();
  const [processing, setProcessing] = useState<boolean>();

  const action = async (info: {
    person_id: number;
    next_of_kins: QNextOfKins[];
  }) => {
    try {
      setProcessing(true);
      const { person_id, next_of_kins } = info || {};
      const cNextOfKins = next_of_kins?.map((nextOfKin) => {
        return personFormRefactor(nextOfKin);
      });
      if (!person_id)
        throw new Error("Program Error: Person ID does not exist");
      if (!cNextOfKins)
        throw new Error("Program Error: Next of kin profiles do not exist");
      const employee: QTransferEmpWithPerson = {
        person_id,
        next_of_kins: cNextOfKins.map((i) => ({
          next_of_kin: i.profile,
          relationship: i.relationship as string,
        })),
      };

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
      const { data: empData } = await createEmpWithPerson({
        variables: employee,
      });
      setProcessing(false);
      return empData?.employee;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createEmpWithPerson: action, processing };
}
