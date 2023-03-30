import React, { useState } from "react";
import {
  Banks,
  BANK_DIALOG_TYPE,
  IOrgBank,
  BankTxType,
  INotify,
  notifyObject,
  notification,
} from "ui";
import { BOOLEAN_STRING } from "ui/components/types";
import { dummy } from "../../dummy";
import { useBankAction } from "./actions";
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
  const { banks, bank, setBank, createBank, updateBank } = useBankAction();
  const [api, contextHolder] = notification.useNotification();
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
  const openNotification: INotify = (type, props) => {
    api[type](notifyObject(props));
  };
  return (
    <>
      {contextHolder}
      <Banks
        banks={banks as IOrgBank[]}
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
            selections: false,
            onSelect(record) {
              setState({
                openDrawer: true,
                dialogType: BANK_DIALOG_TYPE.VIEW_BANK,
                drawerTitle: "Bank Transactions",
              });
              setBank(record);
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
        bankViewProps={{
          onChangeBankStatus(active) {
            updateBank({ active }, { notify: openNotification });
          },
          onDisplayEdit() {
            setState({
              dialogType: BANK_DIALOG_TYPE.EDIT_BANK,
              drawerTitle: "Edit Bank",
            });
          },
          onBack: () => {
            setState({
              dialogType: BANK_DIALOG_TYPE.VIEW_BANK,
              drawerTitle: "Bank Transactions",
            });
          },
          bank: bank as IOrgBank,
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
        newBankProps={{
          bank: bank as IOrgBank,
          onUpdateBank(bank) {
            updateBank(bank, { notify: openNotification });
            closeDialog();
          },
          onCreateItem(values) {
            values.is_admin = BOOLEAN_STRING.yes;
            createBank(values, { notify: openNotification });
            closeDialog();
          },
        }}
      />
    </>
  );
}
