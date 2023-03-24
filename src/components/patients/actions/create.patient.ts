import { IPatientGraphQlActions } from "app/graph.hooks/patient";
import { IPersonGraphQlActions } from "app/graph.hooks/person";
import { QTransferPatient } from "app/graph.queries/patients/types";
import { AppError } from "ui";
import { patientFormRefactor } from "ui/components/Patients/common";
import { IFormPatient, IPatient } from "ui/components/Patients/types";
import { INewPersonData } from "ui/components/Person";

type IActionCreatePatientProps = Pick<
  IPatientGraphQlActions,
  "createPatient" | "getPatients"
> &
  Pick<IPersonGraphQlActions, "createPerson" | "getPersons"> & {
    info: INewPersonData<IFormPatient>;
  };
export async function actionCreatePatient({
  getPersons,
  getPatients,
  createPatient,
  info,
}: IActionCreatePatientProps): Promise<IPatient | undefined> {
  const { profile, next_of_kins } = info;
  const cNextOfKins = next_of_kins.map((nextOfKin) => {
    return patientFormRefactor(nextOfKin);
  });
  const cProfile = patientFormRefactor(profile as IFormPatient);
  if (
    cProfile.profile.phone_number === cNextOfKins?.[0]?.profile?.phone_number
  ) {
    throw new AppError(
      "Phone numbers for patient and next of kin can't be the same",
      {
        cause: {
          code: 0,
          label: "Same Phone Number",
        },
      }
    );
  }
  const patient: QTransferPatient = {
    oldId: cProfile.oldId as string,
    profile: cProfile.profile,
    next_of_kins: cNextOfKins.map((i) => ({
      next_of_kin: i.profile,
      relationship: i.relationship as string,
    })),
  };
  const { data: ptWithSameNationalID } = await getPatients({
    variables: {
      keyword: {
        person: {
          profile: {
            national_identity: patient.profile.national_identity,
          },
        },
      },
      // patien patient.profile.national_identity,
    },
  });
  if (
    ptWithSameNationalID?.patients &&
    ptWithSameNationalID.patients.length > 0
  ) {
    throw new AppError(
      `Patient with national ID ${patient.profile.national_identity} already exists`,
      {
        cause: {
          code: 0,
          label: "Patient Already Exists!",
        },
      }
    );
  }
  const { data: ptWithSamePhoneNumber } = await getPatients({
    variables: {
      keyword: {
        person: {
          profile: {
            phone_number: patient.profile.phone_number,
          },
        },
      },
    },
  });
  if (
    ptWithSamePhoneNumber?.patients &&
    ptWithSamePhoneNumber.patients.length > 0
  ) {
    throw new AppError(
      `Patient with phone number ${patient.profile.phone_number} already exist`,
      {
        cause: {
          code: 0,
          label: "Patient Already Exists!",
        },
      }
    );
  }

  // checking for person to convert to patient, but has the same phone number
  const { data: dataPersons, error } = await getPersons({
    variables: {
      keyword: {
        profile: {
          phone_number: patient.profile.phone_number,
        },
      },
      limit: 1,
    },
  });
  const { persons: personsWithPhone } = dataPersons || {};
  if (error || personsWithPhone?.[0]) {
    throw new AppError(
      error?.message ||
        `Person with phone number ${patient.profile.phone_number} already exists`,
      {
        cause: {
          code: error ? 0 : 1,
          label: "Existing Phone Number",
          data: personsWithPhone?.[0],
        },
      }
    );
  }
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
  const inputData = {
    old_id: patient.oldId,
    profile: patient.profile,
    next_of_kins: patient.next_of_kins,
  };
  const { data: ptData } = await createPatient({
    variables: inputData,
  });
  return ptData?.patient;
}
