import { QPatient } from "app/graph.queries/patients/types";
import { QAddress, QProfile } from "app/graph.queries/persons/types";

export type IFormProfile = Omit<QProfile, "addresses"> & QAddress;

export type IFormNextOfKin = Pick<
  QProfile,
  "last_name" | "first_name" | "phone_number" | "email"
> &
  QAddress & {
    relationship?: string;
  };
export type IDisplayPatientRecord = Record<keyof QProfile | keyof QPatient, string>;