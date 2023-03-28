import { IEmployee } from "ui";
import { INextOfKin, IProfile } from "ui/components/Person";
import { QNextOfKins } from "../patients/types";
import { QKeywordPerson } from "../persons/types";

export interface QUpdateEmpProfileTransfer {
  _id?: string;
  employee?: Partial<IEmployee>;
  person_xid?: string;
  profile?: Partial<IProfile>;
}
export interface QTransferEmployee {
  oldId?: string;
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
