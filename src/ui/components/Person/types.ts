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
}
