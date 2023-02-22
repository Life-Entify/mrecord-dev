import { Drawer, DrawerProps, Table, TableProps } from "antd";
import React from "react";
import styled from "styled-components";
import { IToolbarProps, Toolbar } from "ui/common/views";
import { INewPatientProps, NewPatient } from "./NewPatient";
import { EditProfileForm, EditProfileFormProps } from "./EditProfile";
import {
  INewPtNotificationProps,
  NewPtNotification,
} from "./NewPtNotification";
import { IViewPatientProps, ViewPatient } from "./ViewPatient/ViewPatient";

const TableContainer = styled.div`
  margin-top: 50px;
`;

export enum PATIENT_DIALOG_TYPE {
  NEW_PATIENT = 1,
  PATIENT_NOTIFICATION = 2,
  VIEW_PATIENT = 3,
  EDIT_PROFILE = 4,
}
export interface IPatientProps<
  IFormProfile,
  IFormNextOfKin,
  IPatient,
  IInforBoardMapKeys extends string | number | symbol,
  INextOfKinData,
  IPerson
> {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps & { drawerType?: PATIENT_DIALOG_TYPE };
  newPatientProps?: INewPatientProps<IFormProfile, IFormNextOfKin>;
  newPtNotificationProps?: INewPtNotificationProps<IInforBoardMapKeys>;
  tableProps?: TableProps<IPatient>;
  viewPatientProps?: IViewPatientProps<
    IPatient,
    INextOfKinData,
    IPerson,
    IInforBoardMapKeys
  >;
  editProfileProps?: EditProfileFormProps<IFormProfile>;
}

export function Patients<
  IFormProfile,
  IFormNextOfKin,
  IPatient extends object,
  IInforBoardMapKeys extends string | number | symbol,
  INextOfKinData,
  IPerson
>({
  drawerProps,
  toolbarProps,
  newPatientProps,
  newPtNotificationProps,
  tableProps,
  viewPatientProps,
  editProfileProps,
}: IPatientProps<
  IFormProfile,
  IFormNextOfKin,
  IPatient,
  IInforBoardMapKeys,
  INextOfKinData,
  IPerson
>) {
  const { drawerType, ...deepDrawerProps } = drawerProps || {};
  return (
    <div>
      <Toolbar {...toolbarProps} />
      <TableContainer>
        <Table<IPatient> {...tableProps} />
      </TableContainer>
      <Drawer {...deepDrawerProps}>
        {drawerType === PATIENT_DIALOG_TYPE.NEW_PATIENT && (
          <NewPatient {...newPatientProps} />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.PATIENT_NOTIFICATION && (
          <NewPtNotification<IInforBoardMapKeys> {...newPtNotificationProps} />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.VIEW_PATIENT && (
          <ViewPatient<IPatient, INextOfKinData, IPerson, IInforBoardMapKeys>
            {...viewPatientProps}
          />
        )}
        {drawerType === PATIENT_DIALOG_TYPE.EDIT_PROFILE && (
          <EditProfileForm<IFormProfile> {...editProfileProps} />
        )}
      </Drawer>
    </div>
  );
}
