import React, { useEffect, useState } from "react";
import { Debts, Deposits } from "ui";
import dayjs from "dayjs";
import { usePaymentAction } from "../payments/actions/payment";
import { dayToTimeStamp } from "app/utils";
import { useDepositAction } from "./actions";
interface IPaymentState {
  openDrawer: boolean;
  drawerTitle: string;
  // dialogType: PAYMENT_DIALOG_TYPE;
}

export default function DepositComponent() {
  const { setPaymentQuery, payments } = usePaymentAction();
  const { depositSummary, getDepositSummary } = useDepositAction();
  const [state, _setState] = useState<Partial<IPaymentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPaymentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  useEffect(() => {
    setPaymentQuery({
      dateFilter: {
        date_stamp_from: dayToTimeStamp(new Date()),
        date_stamp_to: dayToTimeStamp(new Date()),
      },
      keyword: {
        action_type: "receive_deposit",
      },
    });
  }, []);
  console.log(depositSummary);
  return (
    <Deposits
      toolbarProps={{
        dateRangePickerProps: {
          defaultValue: [
            dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
            dayjs(new Date().toLocaleDateString(), "DD/MM/YYYY"),
          ],
          onChange(_, formatString) {
            setPaymentQuery({
              dateFilter: {
                date_stamp_from: dayToTimeStamp(new Date(formatString[0])),
                date_stamp_to: dayToTimeStamp(new Date(formatString[1])),
              },
            });
          },
        },
      }}
      tabsProps={{
        onChange(activeKey) {
          if (activeKey === "depositors") {
            getDepositSummary();
          }
        },
      }}
      depositHxProps={{
        tableProps: {
          dataSource: payments,
        },
      }}
    />
  );
}
