import { IPatient } from "ui/components/Patients/types";
import { IAddress, INextOfKin, IPerson, IProfile } from "ui/components/Person";
import { QKeywordPerson } from "../persons/types";

export interface QUpdatePtProfileTransfer {
  _id?: string;
  patient?: Partial<IPatient>;
  person_xid?: string;
  profile?: Partial<IProfile>;
}
export interface QTransferPatient {
  oldId?: string;
  profile: Partial<IProfile>;
  next_of_kins: QNextOfKins[];
}
export interface QTransferPtWithPerson {
  old_id?: string;
  person_id: number;
  next_of_kins: QNextOfKins[];
}
export interface QTransferPtWithNok {
  old_id?: string;
  profile: Partial<IProfile>;
  next_of_kins: INextOfKin[];
}
export interface QTransferPtWithMeta {
  old_id?: string;
  person_id: number;
  next_of_kins: INextOfKin[];
}
export interface QNextOfKins {
  relationship: string;
  next_of_kin: Partial<IProfile>;
}

export type QKeywordPatient = {
  patient?: Pick<IPatient, "_id" | "patient_id"> & {
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
  | (keyof IAddress)[]
  | (keyof IProfile)[]
  | (keyof IPerson)[]
  | (keyof INextOfKin)[];
export interface NestedPatientObject {
  addresses?: (keyof IAddress)[];
  profile?: (keyof IProfile)[];
  person?: (keyof IPerson)[];
  next_of_kins?: (keyof INextOfKin)[];
}
