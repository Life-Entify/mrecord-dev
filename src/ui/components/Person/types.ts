import { IBank } from "../Accounts";

export interface IProfile {
  last_name: string;
  first_name: string;
  middle_name: string;
  phone_number: string;
  gender: string;
  occupation: string;
  national_identity: string;
  dob: string;
  email: string;
  addresses: IAddress[];
}
export interface IAddress {
  _id: string;
  street: string;
  town: string;
  lga: string;
  nstate: string;
  country: string;
}
export interface IPerson {
  _id: string;
  person_id: string;
  profile: IProfile;
  next_of_kins: INextOfKin[];
  next_of_kins_details?: INextOfKinDetails[];
  bank?: IBank;
}

export interface INextOfKin {
  person_id: string;
  relationship: string;
}
export interface IFamilyMemberDetails {
  next_of_kin: Partial<IPerson>;
  relationship: string;
}

export interface INextOfKinDetails extends IFamilyMemberDetails {}

export type IFormPerson = Omit<IProfile, "addresses"> & IAddress;

type AddPrefix<T, K extends string> = {
  [P in keyof T as P extends string ? `${K}${P}` : never]: T[P];
};

export type IFormNextOfKin = Partial<
  AddPrefix<
    IFormPerson & {
      relationship?: string;
    },
    "nok_"
  >
>;
