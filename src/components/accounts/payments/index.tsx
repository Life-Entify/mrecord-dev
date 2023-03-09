import React, { useState } from "react";
import { IPayment, Payments, PAYMENT_DIALOG_TYPE } from "ui";
import { dummy } from "../../dummy";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: PAYMENT_DIALOG_TYPE;
}
export default function PaymentComponent() {
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const [payment, setPayment] = useState<IPayment>();

  return (
    <Payments
      toolbarProps={{
        newBtnProps: {
          style: { marginLeft: 10 },
          onClick: () =>
            setState({
              openDrawer: true,
              dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT,
              drawerTitle: "New Payment",
            }),
          title: "New Payment",
        },
        extra: {
          categoryBtnProps: {
            onClick: () =>
              setState({
                openDrawer: true,
                dialogType: PAYMENT_DIALOG_TYPE.CATEGORIES,
                drawerTitle: "Payment Categories",
              }),
          },
        },
      }}
      drawerProps={{
        title: state.drawerTitle,
        open: state.openDrawer,
        drawerType: state.dialogType,
        onClose: () =>
          setState({
            openDrawer: false,
            drawerTitle: undefined,
            dialogType: undefined,
          }),
        size: "large",
      }}
      paymentCategoryProps={{
        incomeProps: {
          listProps: {
            onActionClick(type, item) {
            },
            dataSource: dummy.category,
          },
        },
      }}
      paymentTableProps={{
        payments: dummy.payments,
        showTx: false,
        tableProps: {
          rowSelection: {
            selectedRowKeys: [0],
            type: "radio",
            onSelect(record) {
              setState({
                openDrawer: true,
                drawerTitle: "Payment Transactions",
                dialogType: PAYMENT_DIALOG_TYPE.PAYMENT_TXS,
              });
              setPayment(record);
            },
          },
        },
      }}
      paymentTxsProps={{
        payment,
        txTableProps: {
          onShowReceipt: () => {
            setState({
              dialogType: PAYMENT_DIALOG_TYPE.SHOW_RECEIPT,
              drawerTitle: "Payment Receipt",
            });
          },
        },
      }}
      paymentReceiptProps={{
        org: dummy.settings.org,
        onBack: () => {
          setState({
            dialogType: PAYMENT_DIALOG_TYPE.PAYMENT_TXS,
            drawerTitle: "Payment Transactions",
          });
        },
      }}
    />
  );
}
