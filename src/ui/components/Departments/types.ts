//TODO// This should be dynamic and come from database
export enum APPLICATIONS {
  records = "records",
  accounts = "accounts",
  hr = "hr",
}
export interface IDepartment {
  _id?: string;
  name: string;
  description?: string;
  app?: APPLICATIONS;
}
