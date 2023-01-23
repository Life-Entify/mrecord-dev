import { Drawer } from "antd";
import React, { Reducer, ReducerAction, useReducer } from "react";
import { Patients } from "ui/components/Patients";

interface IPatientState {
  openDrawer: boolean;
  drawerTitle?: string;
}
enum ACTIONS {
  NEW_PATIENT = 1,
  CLOSE_NEW_PATIENT = 2,
}
const stateReducer: Reducer<
  IPatientState,
  { type: ACTIONS; payload?: Partial<IPatientState> }
> = (state, action) => {
  switch (action.type) {
    case ACTIONS.NEW_PATIENT:
      return {
        ...state,
        openDrawer: true,
        drawerTitle: "New Patient",
      };
    case ACTIONS.CLOSE_NEW_PATIENT:
      return {
        ...state,
        openDrawer: false,
        drawerTitle: undefined,
      };
    default:
      throw new Error("Unknown action " + action.type);
  }
};
export default function () {
  const [state, dispatch] = useReducer(stateReducer, {
    openDrawer: false,
  });
  return (
    <Patients
      createNewPatient={(values) => {
        console.log(values);
        dispatch({ type: ACTIONS.CLOSE_NEW_PATIENT });
      }}
      toolbarProps={{
        newBtnProps: {
          onClick: () => dispatch({ type: ACTIONS.NEW_PATIENT }),
          title: "New Patient",
        },
      }}
      drawerProps={{
        title: state.drawerTitle,
        open: state.openDrawer,
        onClose: () => dispatch({ type: ACTIONS.CLOSE_NEW_PATIENT }),
      }}
    />
  );
}
