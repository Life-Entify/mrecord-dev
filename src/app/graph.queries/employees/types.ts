import { IEmployee, ILogin } from "ui";
import { IAddress, INextOfKin, IPerson, IProfile } from "ui/components/Person";
import {
  IQueryArray,
  NestedPatientObject,
  QNextOfKins,
} from "../patients/types";
import { QKeywordPerson } from "../persons/types";

export interface QUpdateEmpProfileTransfer {
  _id?: string;
  employee?: Partial<IEmployee>;
  person_xid?: string;
  profile?: Partial<IProfile>;
}
export interface QTransferEmployee {
  profile: Partial<IProfile>;
  next_of_kins: QNextOfKins[];
}
export interface QTransferEmpWithPerson {
  person_id: number;
  next_of_kins: QNextOfKins[];
}
export interface QTransferEmpWithNok {
  profile: Partial<IProfile>;
  next_of_kins: INextOfKin[];
}
export interface QTransferEmpWithMeta {
  person_id: number;
  next_of_kins: INextOfKin[];
}
export type QKeywordEmployee = {
  employee?: Pick<IEmployee, "_id" | "employee_id">;
  person?: QKeywordPerson;
};
export interface QEmployeeQueryParams {
  keyword?: QKeywordEmployee;
  limit?: number;
  skip?: number;
}
export type IEmployeeQueryArray = IQueryArray | keyof ILogin;

export interface IEmployeeNestedQueryObject extends NestedPatientObject {
  logins: (keyof ILogin)[];
}
export interface IEmployeeQueryReturnData extends IEmployeeNestedQueryObject {
  employee: (keyof IEmployee)[];
}
