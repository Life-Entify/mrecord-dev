import { NoticePayload } from "../../reducers.slices/notice.core";

const pkg = "[NOTICE]";
export const SUCCESS_NOTICE = `${pkg} success`;
export const ERROR_NOTICE = `${pkg} error`;
export const WARNING_NOTICE = `${pkg} warning`;
export const INFO_NOTICE = `${pkg} info`;
export const CLOSE_NOTICE = `${pkg} close`;
type SnackbarPayload = Omit<NoticePayload, "type">;
export const showSuccessNotice = (payload: SnackbarPayload) => ({
  type: SUCCESS_NOTICE,
  payload,
});
export const showErrorNotice = (payload: SnackbarPayload) => ({
  type: ERROR_NOTICE,
  payload,
});
export const showWarningNotice = (payload: SnackbarPayload) => ({
  type: WARNING_NOTICE,
  payload,
});
export const showInfoNotice = (payload: SnackbarPayload) => ({
  type: WARNING_NOTICE,
  payload,
});
export const hideNotice = {
  type: CLOSE_NOTICE,
};
