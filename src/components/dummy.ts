import {
  IBank,
  IBankTx,
  ICashBundle,
  IOrgBank,
  IPayment,
  IStaff,
  ITx,
  IPaymentCategory,
  IPaymentReceiver,
  IPayroll,
  IPaySlip,
  IPayrollAction,
  IDepartment,
  APPLICATIONS,
  ILogin,
} from "ui";
import { IAppointment } from "ui/components/Appointments/types";
import { IPatient } from "ui/components/Patients/types";
import { IPerson } from "ui/components/Person";
import { IOrganization, ISetting } from "ui/components/Settings";
const sampleBank: IBank = {
  _id: "1",
  name: "St. Mary",
  bank: "First Bank",
  description: "Our main bank",
  number: 8989900000,
  branch: "Owerri",
};
const category: IPaymentCategory[] = [
  {
    _id: "1",
    title: "New Folders",
    type: "income",
    description: "This is the new folders",
  },
  {
    _id: "2",
    title: "New Folders",
    type: "expenditure",
    description: "This is the new folders",
  },
];

const txs: ITx[] = [
  {
    _id: "1",
    tx_type: "expenditure",
    amount: 5000,
    payment_id: "23",
    category_id: "1",
    created_at: "2023/03/01",
    remark: "something",
  },
];
const payments: IPayment[] = [
  {
    _id: "23",
    pay_type: "cash",
    person_id: "1",
    staff_id: "2",
    txIds: ["2"],
    tx_type: "expenditure",
    total_amount: 29000,
    created_at: "2023/03/02",
    action: "pay",
    txs,
  },
];
const org: IOrganization = {
  name: "St. Mary's Hospital",
  address: "No address Umuowa",
  phones: ["0095885995", "9885889599959959"],
};
const settings: ISetting = {
  org,
};
const cashBundles: ICashBundle[] = [
  {
    _id: "id",
    title: "Amaka 2022",
    total_amount: 200000,
    payment_ids: ["2", "3"],
    payments: payments,
    bankmove_id: "1",
    bank: sampleBank,
  },
  {
    _id: "id",
    title: "Amaka 2022",
    total_amount: 200000,
    payment_ids: ["2", "3"],
    payments: payments,
  },
];
const person: IPerson = {
  _id: "1",
  person_id: 1,
  next_of_kins: [
    {
      relationship: "father",
      person_id: 1,
    },
  ],
  profile: {
    last_name: "Agu",
    first_name: "chijioke",
    middle_name: "chima",
    dob: "1988/08/11",
    occupation: "physiotherapist",
    national_identity: "234",
    phone_number: "+2348064668635",
    gender: "m",
    email: "chokey2nv@gmail.com",
    addresses: [
      {
        _id: "address1",
        street: "11 Eze street",
        town: "Enugu",
        lga: "Enugu-East",
        nstate: "Enugu",
        country: "Nigeria",
      },
    ],
  },
  bank: sampleBank,
};
const patient: IPatient = {
  _id: "1",
  patient_id: "1",
  old_id: "1",
  person_id: "1",
  person: person,
};
const login: ILogin = {
  _id: "1",
  username: "chokey2nv",
  password: "1234",
  department_id: "1",
};
const staff: IStaff = {
  staff_id: "1",
  person: structuredClone(person) as IPerson,
  _id: "1",
  person_id: "1",
  department_ids: ["1"],
  // departments: [],
  logins: [login],
};
const bankTx: IBankTx = {
  _id: "129484",
  ref_id: "ref from bank",
  staff_id: "3455sd",
  bank_id: "dfsfds",
  amount: 30000,
  description: "staff salary",
  created_at: "2023-02-25",
  tx_type: "expenditure",
  payment_id: "",
};

const orgBank: IOrgBank = {
  ...sampleBank,
  balance: 0,
};
const paymentReceiver: IPaymentReceiver = {
  ...staff,
  type_count: {
    cash: {
      income: 20000,
      expenditure: 20000,
    },
    cheque: {
      income: 140000,
      expenditure: 30000,
    },
    transfer: {
      income: 3443,
      // expenditure: 399000,
    },
  },
  action_count: {
    receive_deposit: 20000,
    receive_pay: 3000,
    redeem_credit: 30000,
    register_credit: 4000,
    deposit_withdrawal: 5000,
    pay: 3000,
    loan: 0,
    loan_repayment: 3000,
  },
  date: "",
};
const bonus: IPayrollAction = {
  name: "Gross salary",
  description: "this is the gross salary of the staff",
  active: true,
  is_general: true,
  action_kind: "value",
  amount: 10000,
  is_constant: true,
  action_type: "bonus",
};
const deduction: IPayrollAction = {
  name: "Gross Deduction",
  description: "this is the gross salary of the staff",
  active: true,
  is_general: false,
  action_kind: "value",
  amount: 10000,
  is_constant: true,
  action_type: "deduction",
};
const paySlip: IPaySlip = {
  _id: "1",
  bonus_amount: 100000,
  deducted_amount: 20000,
  staff_id: "1",
  bonuses: [bonus],
};
const payroll: IPayroll = {
  _id: "1",
  name: "Salary Feb, 2022",
  description: "This is the description for the payroll item",
  total_amount: 3000000,
  pay_slips: [paySlip],
};

const department: IDepartment = {
  _id: "1",
  name: "Records",
  description: "Store patient information",
  app: APPLICATIONS.records,
};
const appointment: IAppointment = {
  _id: "1",
  date: new Date().toLocaleString(),
  patient_id: patient._id,
  department_id: department._id as string,
  patient,
  department,
};
export const dummy = {
  category,
  cashBundles,
  payments,
  settings,
  staff: [staff],
  bankTx: [bankTx],
  orgBanks: [orgBank],
  receivers: [paymentReceiver, paymentReceiver],
  payrolls: [payroll],
  deductions: [deduction],
  bonuses: [bonus],
  patients: [patient],
  departments: [department],
  appointments: [appointment],
};
