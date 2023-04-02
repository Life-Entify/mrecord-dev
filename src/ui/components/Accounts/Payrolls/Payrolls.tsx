import { Button, DrawerProps, Table, TableProps, Tabs } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { IPayroll, IPayrollAction } from "../types";
import { INewPayrollActionProps, NewPayrollAction } from "./Actions";
import { getPayrollTableColumns } from "./data";
import { IPayrollActionProps, PayrollAction } from "./Actions/PayrollAction";
import { IViewPayrollProps, ViewPayroll } from "./ViewPayroll";
import { IPaySlipProps, PaySlip } from "./PaySlip";
import { IEmployeeProps, Staff } from "ui/components/Employees";
import {
  IViewPayrollActionProps,
  ViewPayrollAction,
} from "./Actions/ViewPayrollAction";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum PAYROLL_DIALOG_TYPE {
  NEW_PAYROLL,
  NEW_ACTION,
  VIEW_PAYROLL_ACTION,
  VIEW_PAYROLL,
  SHOW_PAYSLIP,
  SHOW_EMPLOYEES,
}
export interface IPayrollsProps {
  payrolls: IPayroll[];
  activeActions?: IPayrollAction[];
  toolbarProps?: Omit<IToolbarProps, "extra"> & {
    onOpenNewAction?: React.MouseEventHandler;
  };
  drawerProps?: DrawerProps & { drawerType?: PAYROLL_DIALOG_TYPE };
  payrollActionProps: Omit<IPayrollActionProps, "actions"> & {
    payrollActions?: {
      deductions?: IPayrollAction[];
      bonuses?: IPayrollAction[];
    };
  };
  viewPayrollActionProps?: IViewPayrollActionProps;
  newPayrollAction?: INewPayrollActionProps;
  payrollTableProps?: Omit<
    TableProps<IPayroll>,
    "columns" | "size" | "dataSource"
  >;
  employeeProps?: IEmployeeProps;
  viewPayrollProps?: IViewPayrollProps;
  paySlipProps?: IPaySlipProps & {
    onBack?: React.MouseEventHandler;
  };
}

export function Payrolls({
  payrolls,
  drawerProps,
  toolbarProps,
  newPayrollAction,
  viewPayrollActionProps,
  employeeProps,
  payrollTableProps,
  viewPayrollProps,
  paySlipProps,
  payrollActionProps,
}: IPayrollsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onOpenNewAction, ...deepToolbarProps } = toolbarProps || {};
  const { onBack: paySlipBack, ...deepPaySlipProps } = paySlipProps || {};
  const { payrollActions, ...deepPayrollActionProps } =
    payrollActionProps || {};
  const getExtra = useCallback(
    (type?: PAYROLL_DIALOG_TYPE) => {
      switch (type) {
        case PAYROLL_DIALOG_TYPE.SHOW_PAYSLIP:
          return <Button onClick={paySlipBack}>Back</Button>;
      }
      return null;
    },
    [!!paySlipBack]
  );
  return (
    <Root>
      {toolbarProps && (
        <Toolbar
          {...deepToolbarProps}
          extra={<Button onClick={onOpenNewAction}>New Action</Button>}
        />
      )}
      <Container>
        <Tabs
          items={[
            {
              label: "Payrolls",
              key: "payrolls",
              children: (
                <Table
                  {...payrollTableProps}
                  columns={getPayrollTableColumns()}
                  size="small"
                  dataSource={payrolls}
                />
              ),
            },
            {
              label: "Deductions",
              key: "deductions",
              children: (
                <PayrollAction
                  key="deduction-display"
                  {...deepPayrollActionProps}
                  actions={payrollActions?.deductions}
                />
              ),
            },
            {
              label: "Bonuses",
              key: "bonuses",
              children: (
                <PayrollAction
                  key="bonus-display"
                  {...deepPayrollActionProps}
                  actions={payrollActions?.bonuses}
                />
              ),
            },
          ]}
        />
        {/* <Table<IPatient> {...tableProps} /> */}
        <AppDrawer {...deepDrawerProps} extra={getExtra(drawerType)}>
          {drawerType === PAYROLL_DIALOG_TYPE.NEW_ACTION && (
            <NewPayrollAction {...newPayrollAction} />
          )}
          {drawerType === PAYROLL_DIALOG_TYPE.VIEW_PAYROLL_ACTION && (
            <ViewPayrollAction {...viewPayrollActionProps} />
          )}
          {drawerType === PAYROLL_DIALOG_TYPE.VIEW_PAYROLL && (
            <ViewPayroll {...viewPayrollProps} />
          )}
          {drawerType === PAYROLL_DIALOG_TYPE.SHOW_PAYSLIP && (
            <PaySlip {...deepPaySlipProps} />
          )}
          {drawerType === PAYROLL_DIALOG_TYPE.SHOW_EMPLOYEES && (
            <Staff {...employeeProps} />
          )}
        </AppDrawer>
      </Container>
    </Root>
  );
}
