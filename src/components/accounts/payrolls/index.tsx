import { dummy } from "components/dummy";
import React, { useState } from "react";
import { IPayroll, IPaySlip, Payrolls, PAYROLL_DIALOG_TYPE } from "ui";
interface IPayrollState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: PAYROLL_DIALOG_TYPE;
}
const dialogNewPayroll: Partial<IPayrollState> = {
  dialogType: PAYROLL_DIALOG_TYPE.NEW_PAYROLL,
  drawerTitle: "New Payroll",
};
export default function PayrollComponent() {
  const [state, _setState] = useState<Partial<IPayrollState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPayrollState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [payroll, setPayroll] = useState<IPayroll>();
  const [paySlip, setPaySlip] = useState<IPaySlip>();

  return (
    <Payrolls
      toolbarProps={{
        onOpenNewAction() {
          setState({
            openDrawer: true,
            dialogType: PAYROLL_DIALOG_TYPE.NEW_ACTION,
            drawerTitle: "New Payroll Action",
          });
        },
        newBtnProps: {
          style: { marginLeft: 10 },
          onClick: () =>
            setState({
              openDrawer: true,
              ...dialogNewPayroll,
            }),
          title: "New Payroll",
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
      payrollTableProps={{
        rowSelection: {
          selectedRowKeys: [-1],
          type: "radio",
          onSelect(record) {
            setState({
              openDrawer: true,
              drawerTitle: record?.name,
              dialogType: PAYROLL_DIALOG_TYPE.VIEW_PAYROLL,
            });
            setPayroll(record);
          },
        },
      }}
      payrolls={dummy.payrolls}
      payrollDeductionProps={{
        actions: dummy.deductions,
      }}
      payrollBonusProps={{
        actions: dummy.bonuses,
      }}
      viewPayrollProps={{
        payroll,
        staffs: dummy.staff,
        onShowSlip(_, record) {
          setState({
            dialogType: PAYROLL_DIALOG_TYPE.SHOW_PAYSLIP,
            drawerTitle: "Pay Slip",
          });
          setPaySlip(record);
        },
      }}
      paySlipProps={{
        payroll,
        paySlip, // dummy.payrolls?.[0]?.pay_slips?.[0],
        onBack: payroll
          ? () => {
              //TODO: payroll here is undefined
              setState({
                drawerTitle: payroll?.name,
                dialogType: PAYROLL_DIALOG_TYPE.VIEW_PAYROLL,
              });
            }
          : undefined,
      }}
    />
  );
}
