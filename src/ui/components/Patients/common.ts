import { IFormNextOfKinData, IFormPerson, IProfile } from "../Person";
import { formToPerson, spreadPersonData } from "../Person/common";
import { IFormPatient, IPatient } from "./types";

export function spreadPatientData(patient?: IPatient) {
  if (!patient) return undefined;
  return {
    patient_id: patient.patient_id,
    ...spreadPersonData(patient.person, false),
  };
}

export function patientToForm(
  patient: Partial<IPatient>
): Partial<IFormPatient> {
  const { profile } = patient.person || {};
  const address = profile?.addresses?.[0];
  return {
    old_id: patient.old_id,
    last_name: profile?.last_name,
    first_name: profile?.first_name,
    middle_name: profile?.middle_name,
    email: profile?.email,
    gender: profile?.gender,
    occupation: profile?.occupation,
    dob: "", // profile?.dob,
    national_identity: profile?.national_identity,
    phone_number: profile?.phone_number,
    nstate: address?.nstate,
    street: address?.street,
    lga: address?.lga,
    country: address?.country,
    town: address?.town,
  };
}
export const patientFormRefactor = (
  target: IFormNextOfKinData | IFormPatient
): {
  oldId?: string | null;
  profile: Partial<IProfile>;
  relationship?: string | null;
} => {
  let oldId;
  let relationship;

  if ((target as IFormPatient).old_id) {
    oldId = (target as IFormPatient).old_id;
    delete (target as IFormPatient).old_id;
  }
  if ((target as IFormNextOfKinData).relationship) {
    relationship = (target as IFormNextOfKinData).relationship;
    delete (target as IFormNextOfKinData).relationship;
  }
  return {
    oldId,
    profile: formToPerson("address1", target as IFormPerson),
    relationship,
  };
};
