import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import React, { ComponentClass, FunctionComponent } from "react";
import { RootState } from "../store";
export type DialogComponent =
  | string
  | FunctionComponent<any>
  | ComponentClass<any, any>;
export interface BackArrow {
  text: string;
  action?: React.MouseEventHandler<HTMLButtonElement> 
}
  export interface DialogboxState {
  open: boolean;
  component?: DialogComponent;
  onClose?: Function;
  closeButton?: Boolean;
  closeButtonComponent?: DialogComponent;
  backArrow?: BackArrow;
}
export type DialogOpenState = Omit<DialogboxState, "open">;
const initialState: DialogboxState = {
  open: false,
  component: undefined,
  onClose: undefined,
  closeButton: true,
  closeButtonComponent: undefined,
  backArrow: undefined,
};
const dialogboxSlice = createSlice({
  name: "dialogbox",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openDialog: (state, action: PayloadAction<DialogOpenState>) => {
      state = {
        open: true,
        closeButton: true,
        ...action.payload,
      };
      return state;
    },
    setComponent: (state, action: PayloadAction<DialogComponent>) => {
      state.component = action.payload;
      return state;
    },
    setCloseButtonComponent: (
      state,
      action: PayloadAction<DialogComponent>
    ) => {
      state.closeButtonComponent = action.payload;
      return state;
    },
    setArrowBackArrow(state, action: PayloadAction<BackArrow>){
      state.backArrow = action.payload;
      return state;
    },
    closeDialog: (state) => {
      state = initialState;
      return state;
    },
  },
});

export const {
  openDialog,
  setComponent,
  closeDialog,
  setCloseButtonComponent,
  setArrowBackArrow,
} = dialogboxSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDialog = (state: RootState) => state.dialogbox;

export default dialogboxSlice.reducer;
