import { useEmployee } from "app/graph.hooks/employee";
import { IFormEmployee } from "ui/components/Employees/types";
import { INextOfKin, personFormRefactor } from "ui/components/Person";
import React, { useState } from "react";

export function useCreateEmployeeWithNok() {
  const { createEmployeeWithNok } = useEmployee();
  const [processing, setProcessing] = useState<boolean>();
  const action = async (info: {
    profile: IFormEmployee;
    next_of_kins: INextOfKin[];
  }) => {
    try {
      setProcessing(true);
      const { profile, next_of_kins } = info || {};
      if (!profile) throw new Error("Program Error: Person ID does not exist");
      if (!next_of_kins)
        throw new Error("Program Error: Next of kin profiles do not exist");
      const empProfile = personFormRefactor(profile as IFormEmployee);

      const { data: empData } = await createEmployeeWithNok({
        variables: {
          next_of_kins,
          profile: empProfile.profile,
        },
      });
      setProcessing(false);
      return empData?.employee;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createEmployeeWithNok: action, processing };
}
