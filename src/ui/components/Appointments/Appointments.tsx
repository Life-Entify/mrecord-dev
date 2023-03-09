import { DrawerProps, Table, TableProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common";
import { AppDrawer } from "ui/common/views/AppDrawer/AppDrawer";
import { getAppointmentTableColumns } from "./data";
import { INewAppointmentProps, NewAppointment } from "./NewAppointments";
import { IAppointment } from "./types";

const Root = styled.div``;
const TableContainer = styled.div`
  margin-top: 20px;
`;

export enum APPOINTMENT_DRAWER_TYPES {
  NEW_APPOINTMENT,
}
export interface IAppointmentProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & {
    drawerType?: APPOINTMENT_DRAWER_TYPES;
  };
  newAppointmentProps?: INewAppointmentProps;
  appointments?: IAppointment[];
  tableProps?: Omit<TableProps<IAppointment>, "columns" | "dataSource">;
}

function AppointmentFunc({
  toolbarProps,
  drawerProps,
  newAppointmentProps,
  tableProps,
  appointments,
}: IAppointmentProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  return (
    <Root>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <TableContainer>
        <Table
          {...tableProps}
          columns={getAppointmentTableColumns()}
          dataSource={appointments}
        />
      </TableContainer>
      <AppDrawer {...deepDrawerProps}>
        {drawerType === APPOINTMENT_DRAWER_TYPES.NEW_APPOINTMENT && (
          <NewAppointment {...newAppointmentProps} />
        )}
      </AppDrawer>
    </Root>
  );
}

export const Appointments = React.memo(AppointmentFunc);
