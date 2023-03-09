import { IDepartment } from "../Departments";
import { IPatient } from "../Patients/types";

export interface IAppointment {
  _id?: string;
  date: string;
  department_id: string;
  department?: IDepartment;
  patient_id: string;
  patient?: IPatient;
}
