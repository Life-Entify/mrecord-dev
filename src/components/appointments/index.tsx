import { dummy } from "components/dummy";
import React, { useState } from "react";
import { Appointments, APPOINTMENT_DRAWER_TYPES } from "ui";

interface IAppointmentState {
  openDrawer: boolean;
  drawerTitle: string;
  dialogType: APPOINTMENT_DRAWER_TYPES;
}
export default function AppointmentComponent() {
  const [state, _setState] = useState<Partial<IAppointmentState>>({
    openDrawer: false,
  });
  const setState = (state: Partial<IAppointmentState>) =>
    _setState((_state) => ({ ..._state, ...state }));
  const closeDialog = () =>
    setState({
      openDrawer: false,
      drawerTitle: undefined,
      dialogType: undefined,
    });
  return (
    <Appointments
      drawerProps={{
        drawerType: state.dialogType,
        title: state.drawerTitle,
        open: state.openDrawer,
        onClose: closeDialog,
      }}
      toolbarProps={{
        newBtnProps: {
          title: "New Appointment",
          onClick: () => {
            setState({
              openDrawer: true,
              dialogType: APPOINTMENT_DRAWER_TYPES.NEW_APPOINTMENT,
              drawerTitle: "New Appointment",
            });
          },
        },
      }}
      appointments={dummy.appointments}
      newAppointmentProps={{
        patients: dummy.patients,
        departments: dummy.departments,
        onCreateItem(values) {
          console.log(values);
        },
      }}
    />
  );
}
