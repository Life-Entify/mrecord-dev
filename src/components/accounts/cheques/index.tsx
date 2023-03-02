import React, { useState } from "react";
import { Cheques, CHEQUE_DIALOG_TYPE } from "ui";
import { dummy } from "../../dummy";
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
  const [state, _setState] = useState<Partial<IChequeState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IChequeState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  return (
    <Cheques
      toolbarProps={{
        newBtnProps: {
          style: { marginLeft: 10 },
          onClick: () =>
            setState({
              openDrawer: true,
              ...dialogNewCheque,
            }),
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
      newChequeProps={{
        banks: dummy.orgBanks,
      }}
    />
  );
}
