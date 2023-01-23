import { Drawer, DrawerProps } from "antd";
import React from "react";
import {
  Form,
  FORM_FIELD_TYPES,
  IToolbarProps,
  Toolbar,
} from "ui/common/views";
import { NewPatient } from "./NewPatient";

export interface IPatientProps {
  toolbarProps?: IToolbarProps;
  drawerProps?: DrawerProps;
  createNewPatient?: (values: any) => void;
}
export const Patients: React.FC<IPatientProps> = ({
  drawerProps,
  toolbarProps,
  createNewPatient,
}) => {
  return (
    <div>
      <Toolbar {...toolbarProps} />
      <Drawer size="large" {...drawerProps}>
        <NewPatient createPatient={createNewPatient} />
      </Drawer>
    </div>
  );
};
