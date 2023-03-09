export enum DEPARTMENTS {
  RECORDS = "records",
  ACCOUNTS = "accounts",
}
export interface IStaff {
  _id: string;
  person_id: string;
  departments: DEPARTMENTS[];
}
