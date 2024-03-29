import React from "react";
import { IPerson } from "../Person";
import { IEmployee } from "../Employees/Employee";
import { BOOLEAN_STRING } from "../types";

export interface IDateFilter {
  date_stamp_from?: string;
  date_stamp_to?: string;
}
export interface IActionTypeAccount {
  action_type: AccountAction;
  total_amount: number;
}
export interface IPayTypeAccount {
  pay_type: PaymentType;
  tx_type: TxType;
  total_amount: number;
}
export type IAccountDeposits =
  | AccountAction.deposit_withdrawal
  | AccountAction.receive_deposit
  | AccountAction.use_deposit;
export type IDepositorSummary = Record<IAccountDeposits, number> & {
  person_id: number;
  name: string;
  balance?: number;
};
export interface IPaymentSummaryEmp {
  employee: Omit<IEmployee, "logins">;
  action_types: IActionTypeAccount[];
  pay_types: IPayTypeAccount[];
}
export interface IDepositBalance {
  used: number;
  withdrawn: number;
  deposit: number;
}
export interface IPaymentCatDiff {
  income: IPaymentCategory[];
  expenditure: IPaymentCategory[];
}
export interface IPaymentCategory {
  _id: string;
  title: React.ReactNode;
  type: keyof typeof TxType;
  description?: React.ReactNode;
}

export enum LIST_ACTIONS {
  EDIT = "edit",
  DELETE = "delete",
}
export interface IOrgBank extends IBank {
  balance: number;
}
export interface IBank {
  _id: string;
  bank: string;
  name: string;
  number: number;
  branch: string;
  description: string;
  is_admin: BOOLEAN_STRING;
  active: BOOLEAN_STRING;
}

export interface ICashFlow {
  _id: string;
  payment_id: string;
  amount: number;
  direction: "in" | "out";
}

export interface Deposit {
  _id: string;
  person_id: number;
  amount: number;
  description: string;
}
export interface IDebt {
  _id: string;
  person_id: number;
  amount: number;
  payment_id: string;

  payment?: IPayment;
}

export enum TxType {
  income = "income",
  expenditure = "expenditure",
}
export interface ITx {
  _id: string;
  tx_type: keyof typeof TxType;
  amount: number;
  payment_id: string;
  created_at: string;
  category_id: string;
  category?: IPaymentCategory;
  remark: string;
}
export enum PaymentType {
  cash = "cash",
  transfer = "transfer",
  cheque = "cheque",
}
export enum AccountAction {
  receive_pay = "receive_pay",
  pay = "pay",
  receive_deposit = "receive_deposit",
  deposit_withdrawal = "deposit_withdrawal",
  register_credit = "register_credit",
  use_deposit = "use_deposit",
  redeem_credit = "redeem_credit",
  loan = "loan",
  loan_repayment = "loan_repayment",
}
export enum IExpenditureAction {
  deposit_withdrawal = "deposit_withdrawal",
  pay = "pay",
  loan = "loan",
}
export enum IIncomeActions {
  receive_pay = "receive_pay",
  receive_deposit = "receive_deposit",
  register_credit = "register_credit",
  redeem_credit = "redeem_credit",
  use_deposit = "use_deposit",
  loan_repayment = "loan_repayment",
}
export enum IncomeInternal {
  use_deposit = "use_deposit",
}
export enum IncomeDeposit {
  receive_deposit = "receive_deposit",
}
export enum IncomeExternal {
  register_credit = "register_credit",
}
export type IncomeFalse = keyof (typeof IncomeExternal &
  typeof IncomeInternal &
  typeof IncomeDeposit);

export interface IPayment {
  _id: string;
  pay_type: keyof typeof PaymentType;
  tx_type: keyof typeof TxType;
  action_type: keyof typeof AccountAction;
  // receive/pay money from pt or staff or write description
  person_id?: number;
  bank_id?: string;
  cheque_id?: string;
  person?: IPerson;
  description?: string;
  client?: string;
  //staff in charge of the system
  employee_id: number;
  employee?: IEmployee;
  //txs that show the categories in the payment
  tx_ids: string[];
  txs?: ITx[];

  total_amount: number;
  created_at: string;

  //monitor delayed transfer entry
  unresolved?: BOOLEAN_STRING;
}

export enum BankTxType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
}
export interface IBankTx {
  _id: string;
  tx_type: BankTxType; // BankTxType;
  employee_id: number;
  employee?: Partial<IEmployee>;
  bank_id: string;
  bank?: Partial<IOrgBank>;
  amount: number;
  description?: string;
  payment_type: keyof typeof PaymentType;
  created_at: string;
  payment_id?: string;
}
export interface ICashBundle {
  _id: string;
  title: string;
  payment_ids: string[];
  payments?: IPayment[];
  total_amount: number;
  bankmove_id?: string;
  bank?: IBank;
  cashout_amount?: number;
  cashout_payment_ids?: string[];
  cashout_payments?: IPayment[];
}

// export type IPaymentForm = Pick<
//   IPayment,
//   "tx_type" | "pay_type" | "total_amount" | "person_id" | "description"
// > & {
//   txs: Pick<
//     ITx,
//     "amount" | "category_id" | "created_at" | "remark" | "tx_type"
//   >;
// };
export interface IPaymentForm extends IPayment {}

export type IPaymentTypeCount = Partial<
  Record<PaymentType, Partial<Record<keyof typeof TxType, number>>>
>;
export type IPaymentActionCount = Record<AccountAction, number>;
export interface IPaymentReceiver extends IEmployee {
  date: string;
  action_count?: IPaymentActionCount;
  type_count?: IPaymentTypeCount;
  payments?: IPayment[];
}
export interface ICheque {
  _id?: string;
  cheque_number: string;
  cheque_leaflets: number;
  bank_id: string;
  description?: string;
  bank?: IBank;
  used_leaflets?: number;
  created_at?: string;
}
export interface IChequeForm extends ICheque {}

export enum PAYROLL_ACTION_TYPES {
  bonus = "bonus",
  deduction = "deduction",
}
export enum PAYROLL_ACTION_KINDS {
  value = "value",
  percent = "percent",
}
export interface IPayrollAction {
  _id: string;
  name: string;
  description: string;
  active: boolean;
  is_general: boolean;
  employee_ids?: string[];
  action_type: keyof typeof PAYROLL_ACTION_TYPES;
  action_kind: keyof typeof PAYROLL_ACTION_KINDS;
  amount: number; // value or percent
  is_constant: boolean;
  repeats?: number; //number of times
  // dynamic
  count?: number; //number of times done
  total_value?: number;
}

export interface IPaySlip {
  _id: string;
  employee_id: number;
  bonus_amount: number;
  deducted_amount: number;
  //dynamics
  staff?: IEmployee;
  bonus_ids?: string[];
  bonuses?: IPayrollAction[];
  deduction_ids?: string[];
  deductions?: IPayrollAction[];
  created_at?: string;
}
export interface IPayroll {
  _id?: string;
  name: string;
  description?: string;
  //dynamically added in server in creating
  pay_slips?: IPaySlip[];
  total_amount?: number;
}
