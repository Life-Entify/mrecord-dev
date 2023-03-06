import { IAddress, IProfile } from "ui/components/Person";

export interface QDataPerson {
  _id: string;
  person_id: string;
  profile: IProfile;
}
export interface QAddress {
  _id: string;
  street: string;
  town: string;
  lga: string;
  nstate: string;
  country: string;
}
export interface QPerson {
  person_id: string;
  _id: string;
  profile: IProfile;
}
export type IPersonQueryArray = (keyof (QAddress & IProfile))[];
export interface NestedPersonObject {
  addresses?: (keyof IAddress)[];
  profile?: (keyof IProfile)[];
}
export interface QPersonQueryParams {
  keyword?: QKeywordPerson;
  limit?: number;
  skip?: number;
}
export type QKeywordPerson = Partial<
  Pick<QPerson, "_id" | "person_id"> & {
    profile: Partial<
      Pick<
        IProfile,
        | "first_name"
        | "last_name"
        | "middle_name"
        | "phone_number"
        | "national_identity"
      >
    >;
  }
>;
