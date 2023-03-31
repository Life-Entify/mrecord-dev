import React, { useState } from "react";
import {
  Cheques,
  CHEQUE_DIALOG_TYPE,
  INotify,
  notification,
  notifyObject,
} from "ui";
import { useBankAction } from "../banks/actions";
import { useChequeAction } from "./actions";
interface IChequeState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: CHEQUE_DIALOG_TYPE;
}
const dialogNewCheque: Partial<IChequeState> = {
  dialogType: CHEQUE_DIALOG_TYPE.NEW_BOOKLET,
  drawerTitle: "New Booklet",
};
export default function ChequeComponent() {
  const {
    cheques,
    cheque,
    setCheque,
    createCheque,
    updateCheque,
    deleteCheque,
  } = useChequeAction();
  const { banks } = useBankAction();
  const [api, contextHolder] = notification.useNotification();
  const [state, _setState] = useState<Partial<IChequeState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IChequeState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const openNotification: INotify = (type, props) => {
    api[type](notifyObject(props));
  };
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  return (
    <>
      {contextHolder}
      <Cheques
        cheque={cheque}
        toolbarProps={{
          newBtnProps: {
            style: { marginLeft: 10 },
            onClick: () => {
              setState({
                openDrawer: true,
                ...dialogNewCheque,
              });
              setCheque(undefined);
            },
            title: "New Booklet",
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
        }}
        tableProps={{
          dataSource: cheques,
          banks,
          onEditCheque(cheque) {
            setCheque(cheque);
            setState({
              openDrawer: true,
              ...dialogNewCheque,
              drawerTitle: "Edit Cheque",
            });
          },
          onDeleteCheque(cheque) {
            openNotification("warning", {
              key: "delete-cheque",
              message: "Warning",
              description: `Sure you want to delete cheque with number ${cheque.cheque_number}?`,
              btn: [
                {
                  children: "Cancel",
                  type: "primary",
                  onClick: () => api.destroy("delete-cheque"),
                },
                {
                  children: "Proceed",
                  onClick: () => {
                    api.destroy("delete-cheque");
                    deleteCheque(cheque._id, { notify: openNotification });
                  },
                },
              ],
            });
          },
        }}
        newChequeProps={{
          banks,
          onCreateCheque(values) {
            createCheque(values, { notify: openNotification }).then(
              closeDialog
            );
          },
          onUpdateCheque(values) {
            updateCheque(values, { notify: openNotification }).then(
              closeDialog
            );
          },
        }}
      />
    </>
  );
}
