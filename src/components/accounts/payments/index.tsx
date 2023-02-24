import React, { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  Payments,
  PAYMENT_DIALOG_TYPE,
} from "ui";
import { dummy } from "../dummy";
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
              console.log(type, item);
            },
            dataSource: dummy.category,
          },
        },
      }}
    />
  );
}
