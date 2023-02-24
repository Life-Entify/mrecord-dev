export interface IBank {
  _id: string;
  bank: string;
  name: string;
  number: number;
  balance: number;
  branch: string;
  description: string;
}
export interface IBankFundChangeForm {
  amount: number;
  description: number;
  action_at: number;
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
export enum PayType {
  CASH = "cash",
  TRANSFER = "cash",
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
  pay_type: PayType;
  tx_type: TxType;
  action: AccountAction;
  person_id: string;
  txIds: string[];
  total_amount: number;
}
export enum BankTxType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal"
}
export interface IBankTx {
  _id: string;
  tx_type: BankTxType;
  staff_id: string;
  bank_id: string;
  amount: number;
  ref_id: number;
}
