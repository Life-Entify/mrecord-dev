export interface IPatient {
  surname: string;
  firstname: string;
  middlename: string;
  gender: string;
  oldId: string;
  occupation: string;
  dob: string;
  address: string;
  email: string;
  phone: string;
  nextOfKins: INextOfKin[];
}
export interface INextOfKin {
  nokName: string;
  nokPhone: string;
  nokAddress: string;
}
