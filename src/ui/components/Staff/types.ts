import { IPerson } from "../Person";

export enum DEPARTMENTS {
  records = "records",
  accounts = "accounts",
}
export interface IStaff {
  _id: string;
  staff_id: string;
  person_id: string;
  departments: DEPARTMENTS[];
  person?: IPerson;
}
