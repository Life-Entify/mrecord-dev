import moment from "moment";
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
import { useBankAction, useBankTxAction } from "./actions";
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
  const { bankTxs, getBankTxs, createBankTx, setBankTx, bankTx } =
    useBankTxAction();
  const [api, contextHolder] = notification.useNotification();
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const [bankTxType, setBankTxType] = useState<BankTxType>();

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
              getBankTxs(record, { notify: openNotification });
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
            setBankTxType(action);
            setBank(record);
            setBankTx(undefined);
          },
        }}
        fundChangeProps={{
          bank,
          banks,
          bankTxType,
          bankTx: bankTx
            ? { ...bankTx, created_at: moment(new Date(bankTx?.created_at)) }
            : undefined,
          onCreateBankTx(bankTx, formRef) {
            bankTx.tx_type = bankTxType as BankTxType;
            if (bank) {
              createBankTx(bank, bankTx, { notify: openNotification }).then(
                () => {
                  formRef.current?.resetFields();
                  setState({
                    dialogType: BANK_DIALOG_TYPE.VIEW_BANK,
                    drawerTitle: "Bank Transactions",
                  });
                }
              );
            }
          },
        }}
        bankViewProps={{
          onEditBankTx(bankTx) {
            setState({
              dialogType: BANK_DIALOG_TYPE.FUND_CHANGE,
              drawerTitle: "Edit Bank Transaction",
            });
            setBankTxType(bankTx.tx_type);
            setBankTx(bankTx);
            setBank(bank);
          },
          onDeleteBankTx(bankTx) {
            console.log(bankTx);
          },
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
                dialogType: BANK_DIALOG_TYPE.FUND_CHANGE,
                drawerTitle: `${bank?.bank} ${
                  isDeposit ? "Deposit" : "Withdrawal"
                }`,
              });
              setBankTxType(key);
              setBank(bank);
            },
            dateRangePickerProps: {},
          },
          tableProps: {
            dataSource: bankTxs,
          },
        }}
        newBankProps={{
          bank: bank,
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
