import { IPatientGraphQlActions, usePatient } from "app/graph.hooks/patient";
import { IPersonGraphQlActions } from "app/graph.hooks/person";
import {
  QNextOfKins,
  QTransferPatient,
  QTransferPtWithPerson,
} from "app/graph.queries/patients/types";
import { AppError } from "ui";
import { patientFormRefactor } from "ui/components/Patients/common";
import { IFormPatient, IPatient } from "ui/components/Patients/types";
import {
  IFormNextOfKinData,
  INewPersonData,
  INextOfKin,
} from "ui/components/Person";

interface IActionCreatePatientProps
  extends Pick<IPatientGraphQlActions, "createPtWithPerson">,
    Pick<IPersonGraphQlActions, "getPersons"> {
  info?: {
    profile: IFormPatient;
    next_of_kins: INextOfKin[];
  };
}
export async function actionCreatePtWithPerson({
  getPersons,
  createPtWithPerson,
  info,
}: IActionCreatePatientProps): Promise<IPatient> {
  const { createPatientWithNok } = usePatient();
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
  return ptData?.patient;
}
