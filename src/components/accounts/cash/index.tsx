import React, { useState } from "react";
import { Cash, CASH_DIALOG_TYPE } from "ui";
import { dummy } from "../dummy";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: CASH_DIALOG_TYPE;
}
interface ICashState {}
export default function PaymentComponent() {
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<ICashState>) =>
    _setState((_state) => ({ ..._state, ...state }));

  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  return (
    <Cash
      toolbarProps={{
        dateRangePickerProps: {},
      }}
      bundledCashProps={{
        bundles: [
          {
            _id: "id",
            title: "Amaka 2022",
            total_amount: 200000,
            payment_ids: ["2", "3"],
            payments: [
              {
                _id: "23",
                pay_type: "cash",
                person_id: "1",
                staff_id: "2",
                txIds: ["2"],
                tx_type: "expenditure",
                total_amount: 29000,
                created_at: "2023/03/02",
                action: "pay",
              },
            ],
          },
        ],
      }}
    />
  );
}
