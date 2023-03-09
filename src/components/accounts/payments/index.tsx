import React, { useState } from "react";
import {
  IPayment,
  IPaymentForm,
  Payments,
  PAYMENT_DIALOG_TYPE,
  TxType,
} from "ui";
import { dummy } from "../../dummy";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: PAYMENT_DIALOG_TYPE;
}
const dialogNewPayment: Partial<IPaymentState> = {
  dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT,
  drawerTitle: "New Payment",
};
export default function PaymentComponent() {
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [paymentForm, setPaymentForm] = useState<IPaymentForm>();

  const [payment, setPayment] = useState<IPayment>();
  const [txType, setTxType] = useState<TxType>();

  return (
    <Payments
      toolbarProps={{
        newBtnProps: {
          style: { marginLeft: 10 },
          onClick: () =>
            setState({
              openDrawer: true,
              ...dialogNewPayment,
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
            onActionClick(type, item) {},
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
      receiverProps={{
        receivers: dummy.receivers,
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
      newPaymentProps={{
        initialValues: paymentForm,
        banks: dummy.orgBanks,
        cheques: [],
        onCreateItem(values) {
          console.log(values);
        },
        openClient(form) {
          setState({
            dialogType: PAYMENT_DIALOG_TYPE.SHOW_CLIENT,
            drawerTitle: "Select Client",
          });
          setPaymentForm(form.current?.getFieldsValue());
        },
        openPaymentCategory(form, txType) {
          setState({
            dialogType: PAYMENT_DIALOG_TYPE.NEW_PAYMENT_CAT,
            drawerTitle: "Select Payment Categories(s)",
          });
          setTxType(txType);
          setPaymentForm(form.current?.getFieldsValue());
        },
      }}
      personProps={{
        toolbarProps: {
          dateRangePickerProps: {},
        },
        tableProps: {
          rowSelection: {
            type: "radio",
            selectedRowKeys: [-1],
            onSelect(person) {},
          },
        },
        onBack: () => {
          setState({
            ...dialogNewPayment,
          });
        },
      }}
      newPaymentCatProps={{
        incomeCats: dummy.category,
        expenditureCats: dummy.category,
      }}
    />
  );
}
