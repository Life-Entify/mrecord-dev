import { ApolloError } from "@apollo/client";
import { QAddress, QProfile, QPerson } from "app/graph.queries/persons/types";
import { INewPatientData } from "ui/components/Patients/NewPatient";
import { IFormNextOfKin, IFormProfile } from "components/patients/types";
import { AppError } from "ui";
import {
  QTransferPatient,
  QTransferPatientMD,
} from "app/graph.queries/patients/types";
import { IWithPatientProps } from "components/base/hoc/with.patients";

const actionRefactorProfile = <T extends IFormProfile | IFormNextOfKin>(
  target: T
): {
  oldId?: string | null;
  profile: Omit<T, "old_id" | keyof QAddress> & {
    addresses: QAddress[];
  };
  relationship?: string | null;
} => {
  let oldId;
  let relationship;

  if (target.phone_number.includes("+")) {
    target.phone_number = target.phone_number.replaceAll("+", "");
  }
  if ((target as IFormProfile).old_id) {
    oldId = (target as IFormProfile).old_id;
    delete (target as IFormProfile).old_id;
  }
  if ((target as IFormNextOfKin).relationship) {
    relationship = (target as IFormNextOfKin).relationship;
    delete (target as IFormNextOfKin).relationship;
  }
  const address: Partial<QAddress> = {};
  const addressKeys: (keyof QAddress)[] = [
    "street",
    "town",
    "lga",
    "nstate",
    "country",
  ];
  for (let i = 0; i < addressKeys.length; i++) {
    const addKey = addressKeys[i];
    if (target[addKey]) {
      address[addKey] = target[addKey];
      delete target[addKey];
    }
  }
  address._id = "address1";
  return {
    oldId,
    profile: { ...target, addresses: [address as QAddress] },
    relationship,
  };
};
export const actionRemoveNoks = (values: Record<string, any>) => {
  const newValue: Record<string, any> = {};
  for (const name in values) {
    if (Object.prototype.hasOwnProperty.call(values, name)) {
      newValue[name.includes("nok_") ? name.replace("nok_", "") : name] =
        values[name];
    }
  }
  return newValue;
};

type IActionCreatePatientNokMDProps = Pick<
  IWithPatientProps,
  "getPersons" | "createPatientMD" | "createPerson"
> & {
  info: Pick<QTransferPatient, "oldId" | "profile"> &
    Pick<QTransferPatientMD, "next_of_kins">;
};
export async function actionCreatePatientWithNokMD({
  createPerson,
  createPatientMD,
  info,
}: IActionCreatePatientNokMDProps): Promise<AppError<QPerson> | null> {
  try {
    const { profile, oldId, next_of_kins } = info;
    const { data } = await createPerson({
      variables: {
        profile,
      },
    });
    if (!data?.person?.person_id) {
      return new AppError("Error", {
        cause: {
          code: 0,
          label: "Error: Create new patient",
        },
      });
    }
    createPatientMD({
      variables: {
        person_id: data?.person.person_id,
        oldId,
        next_of_kins,
      },
    });
    return null;
  } catch (err) {
    if (err instanceof ApolloError) {
      return new AppError<QPerson>((err as ApolloError).message, {
        cause: { code: 1, label: "User Exists" },
      });
    }
    return err as AppError<QPerson>;
  }
}
type IActionCreatePatientMetaProps = Pick<
  IWithPatientProps,
  "getPersons" | "createPatientMD" | "createPerson"
> & {
  info: Omit<QTransferPatient, "profile"> & { person_id: string };
};
export async function actionCreatePatientWithMD({
  getPersons,
  createPerson,
  createPatientMD,
  info,
}: IActionCreatePatientMetaProps): Promise<AppError<QPerson> | null> {
  try {
    const { person_id, oldId, next_of_kins } = info;

    const nokPhone = next_of_kins[0].next_of_kin.phone_number;
    if (!nokPhone) {
      throw new AppError(`Next of kin phone number missing`, {
        cause: {
          code: 0,
          label: "Next of Kin Profile Error",
        },
      });
    }
    const { data: personData, error: pError } = await getPersons({
      variables: {
        keyword: {
          profile: {
            phone_number: nokPhone,
          },
        },
      },
    });
    const { persons: personsWithPhone } = personData || {};
    if (personsWithPhone?.[0] || pError) {
      throw new AppError(
        pError?.message ||
          `I found next of kin with phone number ${nokPhone}, do you want to use him/her instead?`,
        {
          cause: {
            code: pError ? 0 : 2,
            label: "Existing Next of kin",
            data: personsWithPhone?.[0],
          },
        }
      );
    }
    //create person (next of kin) and use the person_id
    const noks = await Promise.allSettled(
      next_of_kins.map((nok) =>
        createPerson({
          variables: {
            profile: nok.next_of_kin as QProfile,
          },
        })
      )
    );
    const successfulReq: { index: number; person: QPerson }[] = [];
    const failedReq = [];
    for (let i = 0; i < noks.length; i++) {
      const req = noks[i];
      if (req.status === "fulfilled") {
        successfulReq.push({ index: i, person: req.value as QPerson });
      } else {
        failedReq.push({ index: i, reason: req.reason });
      }
    }
    if (successfulReq.length < noks.length) {
      //TODO: Delete all successful
      //find exact next
      return new AppError("Error in creating next of kin profile", {
        cause: {
          code: 0,
          label: "Next of Kin Profile Error!",
        },
      });
    }
    const newPatient = await createPatientMD({
      variables: {
        oldId: oldId,
        person_id: person_id,
        next_of_kins: next_of_kins.map((n, i) => ({
          relationship: n.relationship,
          person_id: successfulReq[i].person._id,
        })),
      },
    });
    return null;
  } catch (err) {
    if (err instanceof ApolloError) {
      return new AppError<QPerson>((err as ApolloError).message, {
        cause: { code: 1, label: "User Exists" },
      });
    }
    return err as AppError<QPerson>;
  }
}
type IActionCreatePatientProps = Pick<
  IWithPatientProps,
  "getPatients" | "getPersons" | "createPatient"
> & {
  info: INewPatientData<IFormProfile, IFormNextOfKin>;
};
export async function actionCreatePatient({
  getPersons,
  getPatients,
  createPatient,
  info,
}: IActionCreatePatientProps): Promise<AppError<{
  result?: QPerson;
  info?: Pick<IActionCreatePatientMetaProps, "info">;
}> | null> {
  try {
    const { profile, next_of_kins } = info;
    const cNextOfKins = next_of_kins.map((nextOfKin) => {
      return actionRefactorProfile<IFormNextOfKin>(
        actionRemoveNoks(nextOfKin) as any
      );
    });
    const cProfile = actionRefactorProfile<IFormProfile>(
      profile as IFormProfile
    );
    const patient: QTransferPatient = {
      oldId: cProfile.oldId,
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
            data: { info, result: personsWithPhone?.[0] },
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
            data: { info, result: nokPerson?.[0] },
          },
        }
      );
    }
    await createPatient({
      variables: {
        oldId: patient.oldId,
        profile: patient.profile,
        next_of_kins: patient.next_of_kins,
      },
    });
    return null;
  } catch (err) {
    if (err instanceof ApolloError) {
      return new AppError((err as ApolloError).message, {
        cause: { code: 1, label: "User Exists" },
      });
    }
    return err as AppError<{
      result?: QPerson;
      info: Pick<IActionCreatePatientMetaProps, "info">;
    }>;
  }
}
