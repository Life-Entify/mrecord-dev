export interface QDataPerson {
  _id: string;
  person_id: string;
  profile: QProfile;
}
export interface QProfile {
  last_name: string;
  first_name: string;
  middle_name: string;
  phone_number: string;
  gender: string;
  old_id?: string;
  occupation: string;
  national_identity: string;
  dob: string;
  email: string;
  addresses: QAddress[];
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
  profile: QProfile;
}
export type IPersonQueryArray = (keyof QAddress)[] | (keyof QProfile)[];
export interface NestedPersonObject {
  addresses?: (keyof QAddress)[];
  profile?: (keyof QProfile)[];
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
        QProfile,
        | "first_name"
        | "last_name"
        | "middle_name"
        | "phone_number"
        | "national_identity"
      >
    >;
  }
>;
