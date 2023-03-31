import { usePatient } from "app/graph.hooks/patient";
import { usePerson } from "app/graph.hooks/person";
import {
  QNextOfKins,
  QTransferPtWithPerson,
} from "app/graph.queries/patients/types";
import { useState } from "react";
import { AppError } from "ui";
import { patientFormRefactor } from "ui/components/Patients/common";
export function useCreatePatientWithPerson() {
  const { getPersons } = usePerson();
  const { createPtWithPerson } = usePatient();
  const [processing, setProcessing] = useState<boolean>();

  const action = async (info: {
    old_id: string;
    person_id: number;
    next_of_kins: QNextOfKins[];
  }) => {
    try {
      setProcessing(true);
      const { person_id, next_of_kins, old_id } = info || {};
      const cNextOfKins = next_of_kins?.map((nextOfKin) => {
        return patientFormRefactor(nextOfKin);
      });
      if (!person_id)
        throw new Error("Program Error: Person ID does not exist");
      if (!cNextOfKins)
        throw new Error("Program Error: Next of kin profiles do not exist");
      const patient: QTransferPtWithPerson = {
        person_id,
        old_id,
        next_of_kins: cNextOfKins.map((i) => ({
          next_of_kin: i.profile,
          relationship: i.relationship as string,
        })),
      };

      // no need searching person with national identity as this will be covered with find patient
      // as next of kin person doesn't record the national identity
      const nokPhone = patient.next_of_kins?.[0]?.next_of_kin.phone_number;
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
      const { data: ptData } = await createPtWithPerson({
        variables: patient,
      });
      setProcessing(false);
      return ptData?.patient;
    } catch (e) {
      setProcessing(false);
      throw e;
    }
  };
  return { createPtWithPerson: action, processing };
}
