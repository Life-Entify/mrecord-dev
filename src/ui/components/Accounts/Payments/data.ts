import React from "react";
import { IPayment } from "../types";

export const paymentLabelMap: Record<keyof IPayment, React.ReactNode> = {
  _id: "ID",
  pay_type: "Payment Type",
  tx_type: "Transaction Type",
  action: "Action",
  person_id: "Person (ID)",
  person: "Person",
  staff_id: "Staff (ID)",
  txIds: "Transaction ID(s)",
  txs: "Transactions",
  total_amount: "Total Amount",
  created_at: "Date",
};
