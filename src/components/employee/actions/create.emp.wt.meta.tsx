import { useEmployee } from "app/graph.hooks/employee";
import React, { useState } from "react";
import { INextOfKin } from "ui/components/Person";

export function useCreateEmployeeWithMeta() {
  const { createEmployeeWithMeta } = useEmployee();
  const [processing, setProcessing] = useState<boolean>();
  const action = async (info: {
    old_id: string;
    person_id: number;
    next_of_kins: INextOfKin[];
  }) => {
    try {
      setProcessing(true);
      const { person_id, next_of_kins } = info || {};
      if (!person_id)
        throw new Error("Program Error: Person ID does not exist");
      if (!next_of_kins)
        throw new Error("Program Error: Next of kin profiles do not exist");

      const { data: empData } = await createEmployeeWithMeta({
        variables: {
          person_id,
          next_of_kins,
        },
      });
      setProcessing(false);
      return empData?.employee;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createEmployeeWithMeta: action, processing };
}
