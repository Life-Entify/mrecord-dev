import React, { useState } from "react";
import { Banks, BANK_DIALOG_TYPE, IOrgBank, BankTxType } from "ui";
import { dummy } from "../../dummy";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: BANK_DIALOG_TYPE;
}
interface IBankState {
  bank: IOrgBank;
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
        dataSource: dummy.orgBanks
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
          dataSource: dummy.bankTx,
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
