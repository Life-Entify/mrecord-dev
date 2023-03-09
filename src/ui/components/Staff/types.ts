import { IDepartment } from "../Departments";
import { IPerson } from "../Person";

export interface ILogin {
  _id?: string;
  department_id: string;
  username: string;
  password: string;
}
export interface IStaff {
  _id: string;
  staff_id: string;
  person_id: string;
  logins?: ILogin[];

  department_ids?: string[];
  departments?: IDepartment[];
  person?: IPerson;
}
