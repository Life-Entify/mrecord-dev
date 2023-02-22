import { IFormNextOfKin, IFormProfile } from "components/patients/types";
import { QAddress, QKeywordPerson, QPerson, QProfile } from "../persons/types";

export interface QUpdatePtProfileTransfer {
  _id?: string;
  patient?: Partial<QPatient>;
  person_id?: string;
  profile?: Partial<QProfile>;
}
export interface QNextOfKin {
  person_id: string;
  relationship: string;
}
export interface QNextOfKinData {
  person: QPerson;
  relationship: string;
}
export interface QPatient {
  _id: string;
  patient_id: string;
  person: QPerson;
  old_id: string;
  next_of_kins: QNextOfKin[];
}
export interface QTransferPatientMD {
  oldId?: string | null;
  person_id: string;
  next_of_kins: {
    person_id: string;
    relationship: string;
  }[];
}
export interface QTransferPatient {
  oldId?: string | null;
  profile: Omit<IFormProfile, "old_id" | keyof QAddress> & {
    addresses: QAddress[];
  };
  next_of_kins: {
    next_of_kin: Omit<IFormNextOfKin, "old_id" | keyof QAddress> & {
      addresses: QAddress[];
    };
    relationship: string;
  }[];
}

export type QKeywordPatient = {
  patient?: Pick<QPatient, "_id" | "patient_id"> & {
    old_id: string;
  };
  person?: QKeywordPerson;
};
export interface QPatientQueryParams {
  keyword?: QKeywordPatient;
  limit?: number;
  skip?: number;
}

export type IQueryArray =
  | (keyof QAddress)[]
  | (keyof QProfile)[]
  | (keyof QPerson)[]
  | (keyof QNextOfKin)[];
export interface NestedPatientObject {
  addresses?: (keyof QAddress)[];
  profile?: (keyof QProfile)[];
  person?: (keyof QPerson)[];
  next_of_kins?: (keyof QNextOfKin)[];
}
