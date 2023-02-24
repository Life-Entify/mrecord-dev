import React, { useState } from "react";
import { Banks, BANK_DIALOG_TYPE, IBank, BankTxType } from "ui";
import { dummy } from "../dummy";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: BANK_DIALOG_TYPE;
}
interface IBankState {
  bank: IBank;
  bankAction: BankTxType;
}
export default function PaymentComponent() {
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const [bankState, _setBankState] = useState<Partial<IBankState>>({});
  const setBankState = (state: Partial<IBankState>) =>
    _setBankState((_state) => ({ ..._state, ...state }));

  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  return (
    <Banks
      toolbarProps={{
        newBtnProps: {
          style: { marginLeft: 10 },
          onClick: () =>
            setState({
              openDrawer: true,
              dialogType: BANK_DIALOG_TYPE.NEW_BANK,
              drawerTitle: "New Bank",
            }),
          title: "New Bank",
        },
      }}
      drawerProps={{
        title: state.drawerTitle,
        open: state.openDrawer,
        drawerType: state.dialogType,
        onClose: closeDialog,
        size: "large",
      }}
      tableProps={{
        scroll: { x: true },
        rowSelection: {
          // selections: true,
          onSelect(record) {
            setState({
              openDrawer: true,
              dialogType: BANK_DIALOG_TYPE.VIEW_BANK,
              drawerTitle: "Bank Transactions",
            });
            setBankState({ bank: record });
          },
          selectedRowKeys: [],
          type: "radio",
        },
        onFundEdit(record, action) {
          setState({
            openDrawer: true,
            dialogType: BANK_DIALOG_TYPE.FUND_CHANGE,
            drawerTitle: `${
              action === BankTxType.DEPOSIT
                ? "Deposit funds to"
                : "Withdraw funds from"
            } ${record.bank}`,
          });
          setBankState({ bank: record, bankAction: action });
        },
        dataSource: [
          {
            _id: "1",
            name: "St. Mary",
            bank: "First Bank",
            description: "Our main bank",
            balance: 0,
            number: 8989900000,
            branch: "Owerri",
          },
        ],
      }}
      fundChangeProps={{
        bank: bankState.bank,
        bankAction: bankState.bankAction,
        newDepositTxProps: {
          category: dummy.category,
          title: <center>Deposit</center>,
        },
        newWithdrawalTxProps: {
          category: dummy.category,
          title: <center>Withdrawal</center>,
        },
      }}
      bankTxProps={{
        onBack: () => {
          setState({
            dialogType: BANK_DIALOG_TYPE.VIEW_BANK,
            drawerTitle: "Bank Transactions",
          });
        },
        bank: bankState.bank,
        toolbarProps: {
          onNewTransaction(key) {
            const isDeposit = key === BankTxType.DEPOSIT;
            setState({
              dialogType: isDeposit
                ? BANK_DIALOG_TYPE.NEW_BANK_TX_DEPOSIT
                : BANK_DIALOG_TYPE.NEW_BANK_TX_WITHDRAWAL,
              drawerTitle: `${bankState.bank?.bank} ${
                isDeposit ? "Deposit" : "Withdrawal"
              }`,
            });
          },
          dateRangePickerProps: {},
        },
        tableProps: {
          dataSource: [
            {
              _id: "129484",
              ref_id: "ref from bank",
              staff_id: "3455sd",
              bank_id: "dfsfds",
              amount: 30000,
              description: "staff salary",
              created_at: "2023-02-25",
              tx_type: "expenditure",
              payment_id: "",
            },
          ],
        },
      }}
      newBankTxProps={{
        depositProps: {
          category: dummy.category,
        },
        withdrawalProps: {
          category: dummy.category,
        },
      }}
    />
  );
}
