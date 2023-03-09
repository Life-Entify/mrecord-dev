import { spreadPersonData } from "../Person/common";
import { IPatient } from "./types";

export function spreadPatientData(patient?: IPatient) {
  if (!patient) return undefined;
  return {
    patient_id: patient.patient_id,
    ...spreadPersonData(patient.person, false),
  };
}
