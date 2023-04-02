import { dummy } from "components/dummy";
import { useEmployeeActions } from "components/employee/actions";
import React, { useState } from "react";
import {
  INotify,
  IPayroll,
  IPayrollAction,
  IPaySlip,
  notification,
  notifyObject,
  Payrolls,
  PAYROLL_DIALOG_TYPE,
} from "ui";
import { usePayrollActionAction } from "./actions";
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
  const [api, contextHolder] = notification.useNotification();
  const { employees } = useEmployeeActions();
  const {
    payrollActions,
    payrollAction,
    createPayrollAction,
    deletePayrollAction,
    setPayrollAction,
    updatePayrollAction,
  } = usePayrollActionAction();
  const [state, _setState] = useState<Partial<IPayrollState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IPayrollState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const [payroll, setPayroll] = useState<IPayroll>();
  const [paySlip, setPaySlip] = useState<IPaySlip>();
  const [newPayrollAction, setNewPayrollAction] =
    useState<Partial<IPayrollAction>>();

  const openNotification: INotify = (type, props) => {
    api[type](notifyObject(props));
  };
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  console.log(payrollActions);
  return (
    <>
      {contextHolder}
      <Payrolls
        toolbarProps={{
          onOpenNewAction() {
            setState({
              openDrawer: true,
              dialogType: PAYROLL_DIALOG_TYPE.NEW_ACTION,
              drawerTitle: "New Payroll Action",
            });
            setPayrollAction(undefined);
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
        newPayrollAction={{
          payrollAction: newPayrollAction as IPayrollAction,
          isEdit: Boolean(payrollAction),
          onFinish() {
            if (newPayrollAction) {
              const isEdit = Boolean(payrollAction);
              if (isEdit) {
                updatePayrollAction(newPayrollAction, {
                  notify: openNotification,
                }).then(closeDialog);
              } else {
                createPayrollAction(newPayrollAction, {
                  notify: openNotification,
                }).then(closeDialog);
              }
            }
          },
          onValuesChange(changedValues) {
            setNewPayrollAction((state) => ({ ...state, ...changedValues }));
          },
          onOpenEmployees() {
            setState({
              dialogType: PAYROLL_DIALOG_TYPE.SHOW_EMPLOYEES,
              drawerTitle: "Select Employee",
            });
          },
        }}
        employeeProps={{
          toolbarProps: {
            newBtnProps: {
              title: "Proceed",
              onClick: () => {
                setState({
                  dialogType: PAYROLL_DIALOG_TYPE.NEW_ACTION,
                  drawerTitle: "New Payroll Action",
                });
              },
            },
          },
          tableProps: {
            dataSource: employees?.map((i) => ({ ...i, key: i._id })),
            rowSelection: {
              selectedRowKeys: newPayrollAction?.employee_ids,
              onChange(selectedRowKeys) {
                setNewPayrollAction((state) => ({
                  ...state,
                  employee_ids: selectedRowKeys as string[],
                }));
              },
            },
          },
        }}
        payrollActionProps={{
          payrollActions,
          onActiveChange(action, active) {
            openNotification("warning", {
              key: "payroll-action-edit-active",
              message: "Warning",
              description: `Sure you want to ${
                active ? "Activate" : "Deactivate"
              } this action`,
              btn: [
                {
                  children: "Cancel",
                  type: "primary",
                  onClick: () => api.destroy("payroll-action-edit-active"),
                },
                {
                  children: "Proceed",
                  onClick: () => {
                    updatePayrollAction(
                      { active },
                      { notify: openNotification, _id: action._id }
                    );
                    api.destroy("payroll-action-edit-active");
                  },
                },
              ],
            });
          },
          onDelete(payrollAction) {
            openNotification("warning", {
              key: "warning-delete-payroll-action",
              message: "Warning",
              description: `Sure you want to delete this action ${payrollAction.name}`,
              btn: [
                {
                  children: "Cancel",
                  type: "primary",
                  onClick: () => api.destroy("warning-delete-payroll-action"),
                },
                {
                  children: "Proceed",
                  onClick: () => {
                    if (payrollAction?._id) {
                      deletePayrollAction(
                        payrollAction._id,
                        payrollAction.action_type,
                        { notify: openNotification }
                      );
                      api.destroy("warning-delete-payroll-action");
                    }
                  },
                },
              ],
            });
          },
          onEdit(payrollAction) {
            //@ts-ignore
            delete payrollAction.__typename;
            setPayrollAction(payrollAction);
            setNewPayrollAction({ ...payrollAction, _id: undefined });
            setState({
              openDrawer: true,
              drawerTitle: "Edit Payroll Action",
              dialogType: PAYROLL_DIALOG_TYPE.NEW_ACTION,
            });
          },
          onView(payrollAction) {
            setPayrollAction(payrollAction);
            setState({
              openDrawer: true,
              dialogType: PAYROLL_DIALOG_TYPE.VIEW_PAYROLL_ACTION,
              drawerTitle: payrollAction.name,
            });
          },
        }}
        viewPayrollActionProps={{
          payrollAction,
        }}
        viewPayrollProps={{
          payroll,
          staffs: employees,
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
    </>
  );
}
