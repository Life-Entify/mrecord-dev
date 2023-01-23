import {
  BackArrow,
  DialogComponent,
  DialogOpenState,
} from "../../reducers.slices/dialog.core";

const pkg = "[DIALOG]";
export const OPEN_DIALOGBOX = `${pkg} open`;
export const CLOSE_DIALOGBOX = `${pkg} close`;
export const SET_COMPONENT = `${pkg} set component`;
export const SET_CLOSE_BUTTON_COMPONENT = `${pkg} set close btn component`;
export const SET_ARROW_BACK_TEXT = `${pkg} set back-arrow text`;

export function showDialogAction(payload: DialogOpenState) {
  return {
    type: OPEN_DIALOGBOX,
    payload,
  };
}
export function setDialogComponentAction(payload: DialogComponent) {
  return {
    type: SET_COMPONENT,
    payload,
  };
}
export const hideDialogBoxAction = {
  type: CLOSE_DIALOGBOX,
};
export function setCloseBtnCompAction(payload: DialogComponent) {
  return {
    type: SET_CLOSE_BUTTON_COMPONENT,
    payload,
  };
}
export function setArrowBackTextAction(payload: BackArrow) {
  return {
    type: SET_ARROW_BACK_TEXT,
    payload,
  };
}
