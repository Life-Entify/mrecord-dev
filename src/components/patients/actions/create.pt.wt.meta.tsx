import { usePatient } from "app/graph.hooks/patient";
import React, { useState } from "react";
import { INextOfKin } from "ui/components/Person";

export function useCreatePatientWithMeta() {
  const { createPatientWithMeta } = usePatient();
  const [processing, setProcessing] = useState<boolean>();
  const action = async (info: {
    old_id: string;
    person_id: number;
    next_of_kins: INextOfKin[];
  }) => {
    try {
      setProcessing(true);
      const { person_id, next_of_kins, old_id } = info || {};
      if (!person_id)
        throw new Error("Program Error: Person ID does not exist");
      if (!next_of_kins)
        throw new Error("Program Error: Next of kin profiles do not exist");

      const { data: ptData } = await createPatientWithMeta({
        variables: {
          old_id,
          person_id,
          next_of_kins,
        },
      });
      setProcessing(false);
      return ptData?.patient;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createPatientWithMeta: action, processing };
}
