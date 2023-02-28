import { INotificationProps } from "components/types";
import React, { useState } from "react";
import { Cash, CASH_DIALOG_TYPE, ICashBundle, notification } from "ui";
import { dummy } from "../../dummy";
interface ICashState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: CASH_DIALOG_TYPE;
}
export default function PaymentComponent() {
  const [state, _setState] = useState<Partial<ICashState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<ICashState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [bundle, setBundle] = useState<ICashBundle>();
  const [api, contextHolder] = notification.useNotification();
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  const openNotification = ({
    message,
    description,
    onClose,
    duration,
    key,
    btn,
  }: INotificationProps) => {
    api.error({
      message,
      description,
      onClose,
      duration,
      key,
      btn,
    });
  };
  return (
    <>
      {contextHolder}
      <Cash
        toolbarProps={{
          dateRangePickerProps: {},
        }}
        drawerProps={{
          drawerType: state.dialogType,
          title: state.drawerTitle,
          open: state.openDrawer,
          onClose: closeDialog,
        }}
        moveToBankProps={{
          banks: dummy.orgBanks,
          bundle: dummy.cashBundles?.[0],
        }}
        bundledCashProps={{
          allBundleProps: {
            bundles: dummy.cashBundles,
            onShowUsages(bundle) {
              setState({
                dialogType: CASH_DIALOG_TYPE.SHOW_BUNDLE,
                drawerTitle: bundle.title,
                openDrawer: true,
              });
              setBundle(bundle);
            },
            onMoveToBank(bundle) {
              if (false) {
                //!dummy.orgBanks?.[0]){
                openNotification({
                  key: "no-bank-created-for-cash-transfer",
                  message: "No Bank Registered",
                  description: "Go to bank and add new bank!",
                });
              } else {
                setState({
                  openDrawer: true,
                  dialogType: CASH_DIALOG_TYPE.CASH_TO_BANK,
                  drawerTitle: "Move Cash to Bank",
                });
              }
            },
          },
        }}
        unbundledCashProps={{
          payments: dummy.payments,
        }}
        viewBundleProps={{
          bundle,
          onDisplaySpendCash() {
            setState({
              openDrawer: true,
              drawerTitle: "Spend Cash - Payment",
              dialogType: CASH_DIALOG_TYPE.SPEND_CASH,
            });
          },
        }}
        spendCashProps={{
          bundle,
          categories: dummy.category,
          onBack() {
            setState({
              dialogType: CASH_DIALOG_TYPE.SHOW_BUNDLE,
              drawerTitle: bundle?.title,
            });
          },
        }}
      />
    </>
  );
}
