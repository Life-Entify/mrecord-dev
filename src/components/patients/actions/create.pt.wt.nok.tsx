import { usePatient } from "app/graph.hooks/patient";
import { patientFormRefactor } from "ui/components/Patients/common";
import { IFormPatient } from "ui/components/Patients/types";
import { INextOfKin } from "ui/components/Person";
import React, { useState } from "react";

export function useCreatePatientWithNok() {
  const { createPatientWithNok } = usePatient();
  const [processing, setProcessing] = useState<boolean>();
  const action = async (info: {
    profile: IFormPatient;
    next_of_kins: INextOfKin[];
  }) => {
    try {
      setProcessing(true);
      const { profile, next_of_kins } = info || {};
      if (!profile) throw new Error("Program Error: Person ID does not exist");
      if (!next_of_kins)
        throw new Error("Program Error: Next of kin profiles do not exist");
      const ptProfile = patientFormRefactor(profile as IFormPatient);

      const { data: ptData } = await createPatientWithNok({
        variables: {
          next_of_kins,
          old_id: ptProfile.oldId as string,
          profile: ptProfile.profile,
        },
      });
      setProcessing(false);
      return ptData?.patient;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createPatientWithNok: action, processing };
}
