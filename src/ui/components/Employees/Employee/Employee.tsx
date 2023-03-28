import {
  Button,
  ButtonProps,
  Drawer,
  DrawerProps,
  Table,
  TableProps,
} from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { bankInputForm, INewBankProps, NewBank } from "../../Accounts";
import {
  ExistingPersonDisplay,
  IExistingPersonDisplayProps,
  IFormPerson,
} from "../../Person";
import { personForm } from "../../Person/data";
import { INewPersonProps, NewPerson } from "../../Person/NewPerson";
import { getStaffColumns } from "./data";
import { IEmpViewProps, EmpView } from "./EmployeeView";
import { IEmployee } from "../types";

const Root = styled.div``;
const Container = styled.div`
  margin-top: 50px;
`;

export enum STAFF_DIALOG_TYPES {
  NEW_STAFF,
  STAFF_VIEW,
  NEW_BANK,
  PERSON_NOTIFICATION,
}
export interface IEmployeeProps {
  drawerProps?: DrawerProps & { drawerType?: STAFF_DIALOG_TYPES };
  tableProps?: TableProps<IEmployee>;
  toolbarProps?: IToolbarProps;
  newStaffProps?: INewPersonProps<IFormPerson>;
  newEmpNotificationProps?: IExistingPersonDisplayProps & {
    onBack?: React.MouseEventHandler;
  };
  staffViewProps?: IEmpViewProps;
  newBankProps?: Omit<INewBankProps, "inputFields"> & {
    onBack?: React.MouseEventHandler;
  };
}

export function Staff({
  toolbarProps,
  tableProps,
  drawerProps,
  newStaffProps,
  staffViewProps,
  newBankProps,
  newEmpNotificationProps,
}: IEmployeeProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onBack: backForNewBank, ...deepNewBankProps } = newBankProps || {};
  const { onBack: newEmpNotifBack, ...deepNewPtNotificationProps } =
    newEmpNotificationProps || {};
  const getExtra = useCallback(
    (type?: STAFF_DIALOG_TYPES) => {
      const BackBtn = (props: ButtonProps) => <Button {...props}>Back</Button>;
      switch (type) {
        case STAFF_DIALOG_TYPES.NEW_BANK:
          return <BackBtn onClick={backForNewBank} />;
        case STAFF_DIALOG_TYPES.PERSON_NOTIFICATION:
          return <BackBtn onClick={newEmpNotifBack} />;
      }
      return null;
    },
    [!!backForNewBank, !!newEmpNotifBack]
  );
  return (
    <Root>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <Container>
        {tableProps && (
          <Table {...tableProps} columns={getStaffColumns()} size="small" />
        )}
        {drawerProps && (
          <Drawer {...deepDrawerProps} extra={getExtra(drawerType)}>
            {drawerType === STAFF_DIALOG_TYPES.NEW_STAFF && (
              <NewPerson {...newStaffProps} personForm={personForm} />
            )}
            {drawerType === STAFF_DIALOG_TYPES.PERSON_NOTIFICATION && (
              <ExistingPersonDisplay {...deepNewPtNotificationProps} />
            )}
            {drawerType === STAFF_DIALOG_TYPES.STAFF_VIEW && (
              <EmpView {...staffViewProps} />
            )}
            {drawerType === STAFF_DIALOG_TYPES.NEW_BANK && (
              <NewBank {...deepNewBankProps} inputFields={bankInputForm} />
            )}
          </Drawer>
        )}
      </Container>
    </Root>
  );
}
