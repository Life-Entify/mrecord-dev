import React, { useState } from "react";
import { Debts, Deposits } from "ui";
import dayjs from "dayjs";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  // dialogType: PAYMENT_DIALOG_TYPE;
}

export default function DepositComponent() {
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  return (
    <Deposits
      toolbarProps={{
        dateRangePickerProps: {
          defaultValue: [
            dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
            dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
          ],
          onChange(_, formatString) {},
        },
      }}
    />
  );
}
