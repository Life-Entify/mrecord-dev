import { IDepartment } from "../Departments";
import { IFormPerson, IPerson, IProfile } from "../Person";

export interface ILogin {
  _id?: string;
  department_id: string;
  username: string;
  password: string;
}
export interface IEmployee {
  _id: string;
  employee_id: string;
  person_id: string;
  logins?: ILogin[];

  department_ids?: string[];
  departments?: IDepartment[];
  person?: IPerson;
}
export interface IFormEmployee extends IFormPerson {}
