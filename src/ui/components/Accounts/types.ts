import React from "react";
import { IPerson } from "../Person";
import { IStaff } from "../Staff";

export interface ITxCategory {
  _id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export enum LIST_ACTIONS {
  EDIT = "edit",
  DELETE = "delete",
}
export interface IBank {
  _id: string;
  bank: string;
  name: string;
  number: number;
  balance: number;
  branch: string;
  description: string;
}

export enum TxType {
  INCOME = "income",
  EXPENDITURE = "expenditure",
}
export interface ITx {
  _id: string;
  tx_type: TxType;
  amount: number;
  payment_id: string;
  created_at: string;
  category_id: string;
  remark: string;
}
export enum PaymentType {
  CASH = "cash",
  TRANSFER = "transfer",
  CHEQUE = "cheque",
}
export enum AccountAction {
  RECEIVE_PAY = "receive_pay",
  PAY = "pay",
  RECEIVE_DEPOSIT = "receive_deposit",
  DEPOSIT_WITHDRAWAL = "deposit_withdrawal",
  REGISTER_CREDIT = "register_credit",
  REDEEM_CREDIT = "redeem_credit",
}
export interface IPayment {
  _id: string;
  pay_type: PaymentType;
  tx_type: TxType;
  action: AccountAction;
  person_id: string;
  person?: IPerson;
  staff_id: string;
  txIds: string[];
  total_amount: number;
  created_at: string;
}
export enum BankTxType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
}
export interface IBankTx {
  _id: string;
  tx_type: string; // BankTxType;
  staff_id: string;
  staff?: Partial<IStaff>;
  bank_id: string;
  bank?: Partial<IBank>;
  amount: number;
  description: string;
  ref_id: string;
  payment_id: string;
  payment?: Partial<IPayment>;
  created_at: string;
}
