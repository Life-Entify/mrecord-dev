import { IFormPerson, IPerson } from "../Person";

export interface IPatient {
  _id: string;
  old_id: string;
  patient_id: string;
  person_id: string;
  person?: IPerson;
  next_of_kins: IPerson[];
}

export interface IFormPatient extends IFormPerson {
  old_id: string;
}
