import {
  IBank,
  IBankTx,
  ICashBundle,
  IOrgBank,
  IPayment,
  IStaff,
  ITx,
  IPaymentCategory,
} from "ui";
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
    description: "This is the new folders",
  },
  {
    _id: "2",
    title: "New Folders",
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
  person_id: "1",
  next_of_kins: [],
  profile: {
    last_name: "Agu",
    first_name: "chijioke",
    middle_name: "chima",
    dob: "1988/08/11",
    occupation: "physiotherapist",
    national_identity: "234",
    phone_number: "08064757757",
    gender: "m",
    email: "chokey2nv@yahoo.com",
    addresses: [
      {
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
const staff: IStaff = {
  staff_id: "1",
  person: structuredClone(person) as IPerson,
  _id: "",
  person_id: "",
  departments: [],
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
export const dummy = {
  category,
  cashBundles,
  payments,
  settings,
  staff: [staff],
  bankTx: [bankTx],
  orgBanks: [orgBank],
};
