import { Button, Drawer, DrawerProps, Table, TableProps } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { INewPatientProps, NewPatient } from "./NewPatient";
import { EditProfileForm, EditProfileFormProps } from "./EditProfile";
import {
  INewPtNotificationProps,
  NewPtNotification,
} from "./NewPtNotification";
import { IViewPatientProps, ViewPatient } from "./ViewPatient/ViewPatient";
import { IPatient } from "./types";
import { getPatientColumns } from "./data";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum PATIENT_DIALOG_TYPE {
  NEW_PATIENT = 1,
  PATIENT_NOTIFICATION = 2,
  VIEW_PATIENT = 3,
  EDIT_PROFILE = 4,
}
export interface IPatientProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & { drawerType?: PATIENT_DIALOG_TYPE };
  newPatientProps?: INewPatientProps;
  newPtNotificationProps?: INewPtNotificationProps & {
    onBack?: React.MouseEventHandler;
  };
  tableProps?: Omit<TableProps<IPatient>, "columns" | "scroll">;
  viewPatientProps?: IViewPatientProps;
  editProfileProps?: EditProfileFormProps & {
    onBack?: React.MouseEventHandler;
  };
}

export function Patients({
  drawerProps,
  toolbarProps,
  newPatientProps,
  newPtNotificationProps,
  tableProps,
  viewPatientProps,
  editProfileProps,
}: IPatientProps) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  const { onBack: editOnBack, ...deepEditProfileProps } =
    editProfileProps || {};
  const { onBack: newPtNotifBack, ...deepNewPtNotificationProps } =
    newPtNotificationProps || {};
  const getExtra = useCallback(
    (type?: PATIENT_DIALOG_TYPE) => {
      switch (type) {
        case PATIENT_DIALOG_TYPE.EDIT_PROFILE:
          return <Button onClick={editOnBack}>Back</Button>;
      }
      switch (type) {
        case PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION:
          return <Button onClick={newPtNotifBack}>Back</Button>;
      }
    },
    [!!editOnBack, !!newPtNotifBack]
  );
  return (
    <div>
      {toolbarProps && <Toolbar {...toolbarProps} />}
      <TableContainer>
        <Table
          {...tableProps}
          scroll={{ x: true }}
          columns={getPatientColumns()}
        />
      </TableContainer>
      <Drawer {...deepDrawerProps} extra={getExtra(drawerType)}>
        {drawerType === PATIENT_DIALOG_TYPE.NEW_PATIENT && (
          <NewPatient {...newPatientProps} />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION && (
          <NewPtNotification {...deepNewPtNotificationProps} />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.VIEW_PATIENT && (
          <ViewPatient {...viewPatientProps} />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.EDIT_PROFILE && (
          <EditProfileForm {...deepEditProfileProps} />
        )}
      </Drawer>
    </div>
  );
}
