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
  income,
  expenditure,
}
export interface ITx {
  _id: string;
  tx_type: TxType;
  amount: number;
  payment_id: string;
  created_at: string;
  category_id: string;
  category?: ITxCategory;
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
  redeem_credit = "redeem_credit",
}
export interface IPayment {
  _id: string;
  pay_type: keyof typeof PaymentType;
  tx_type: keyof typeof TxType;
  action: keyof typeof AccountAction;
  person_id: string;
  person?: IPerson;
  staff_id: string;
  txIds: string[];
  txs?: ITx[];
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
export interface ICashBundle {
  _id: string;
  title: string;
  payment_ids: string[];
  payments?: IPayment[];
  total_amount: number;
}
