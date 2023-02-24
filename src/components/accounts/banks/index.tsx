import React, { useState } from "react";
import { Banks, BANK_DIALOG_TYPE, IBank, BANK_EDIT_ACTIONS } from "ui";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: BANK_DIALOG_TYPE;
}
interface IBankState {
  bank: IBank;
  bankAction: BANK_EDIT_ACTIONS;
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
              drawerTitle: "Bank View",
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
              action === BANK_EDIT_ACTIONS.ADD ? "Add" : "Deduct"
            } Funds from ${record.bank}`,
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
      }}
      bankViewProps={{
        bank: bankState.bank,
        toolbarProps: {
          newBtnProps: {
            title: "New Transaction",
          },
          dateRangePickerProps: {},
        },
      }}
    />
  );
}
