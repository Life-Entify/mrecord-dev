import { Button, DrawerProps, Table, TableProps, Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { IPayroll, IPayrollAction } from "../types";
import { INewPayrollActionProps, NewPayrollAction } from "./Actions";
import { getPayrollTableColumns } from "./data";
import { IPayrollDeductionProps, PayrollAction } from "./Actions/PayrollAction";
import { IViewPayrollProps, ViewPayroll } from "./ViewPayroll";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum PAYROLL_DIALOG_TYPE {
  NEW_PAYROLL,
  NEW_ACTION,
  VIEW_PAYROLL,
}
export interface IPayrollsProps {
  payrolls: IPayroll[];
  activeActions?: IPayrollAction[];
  toolbarProps?: Omit<IToolbarProps, "extra"> & {
    onOpenNewAction?: React.MouseEventHandler;
  };
  drawerProps?: DrawerProps & { drawerType?: PAYROLL_DIALOG_TYPE };
  payrollDeductionProps?: IPayrollDeductionProps;
  payrollBonusProps?: IPayrollDeductionProps;
  newPayrollAction?: INewPayrollActionProps;
  payrollTableProps?: Omit<
    TableProps<IPayroll>,
    "columns" | "size" | "dataSource"
  >;
  viewPayrollProps?: IViewPayrollProps;
}

export function Payrolls({
  payrolls,
  drawerProps,
  toolbarProps,
  payrollDeductionProps,
  payrollBonusProps,
  newPayrollAction,
  payrollTableProps,
  viewPayrollProps,
}: IPayrollsProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onOpenNewAction, ...deepToolbarProps } = toolbarProps || {};
  return (
    <Root>
      {toolbarProps && (
        <Toolbar
          {...deepToolbarProps}
          extra={<Button onClick={onOpenNewAction}>New Action</Button>}
        />
      )}
      <Container>
        <Tabs>
          <Tabs.TabPane key={1} tab="Payrolls">
            <Table
              {...payrollTableProps}
              columns={getPayrollTableColumns()}
              size="small"
              dataSource={payrolls}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Deduction">
            <PayrollAction {...payrollDeductionProps} />
          </Tabs.TabPane>
          <Tabs.TabPane key={3} tab="Bonuses">
            <PayrollAction {...payrollBonusProps} />
          </Tabs.TabPane>
        </Tabs>
        {/* <Table<IPatient> {...tableProps} /> */}
        <AppDrawer {...deepDrawerProps}>
          {drawerType === PAYROLL_DIALOG_TYPE.NEW_ACTION && (
            <NewPayrollAction {...newPayrollAction} />
          )}
          {drawerType === PAYROLL_DIALOG_TYPE.VIEW_PAYROLL && (
            <ViewPayroll {...viewPayrollProps} />
          )}
        </AppDrawer>
      </Container>
    </Root>
  );
}
