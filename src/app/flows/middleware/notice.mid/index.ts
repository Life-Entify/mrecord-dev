import { Middleware } from "@reduxjs/toolkit";
import {
  CLOSE_NOTICE,
  ERROR_NOTICE,
  INFO_NOTICE,
  SUCCESS_NOTICE,
  WARNING_NOTICE,
} from "../../actions/notice.action";
import {
  closeNotice,
  displayNotice,
} from "../../../reducers.slices/notice.core";

const noticeMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    next(action);
    switch (action?.type) {
      case SUCCESS_NOTICE:
        dispatch(
          displayNotice({
            type: "success",
            ...action.payload,
          })
        );
        break;
      case ERROR_NOTICE:
        dispatch(
          displayNotice({
            type: "error",
            ...action.payload,
          })
        );
        break;
      case WARNING_NOTICE:
        dispatch(
          displayNotice({
            type: "warning",
            ...action.payload,
          })
        );
        break;
      case INFO_NOTICE:
        dispatch(
          displayNotice({
            type: "info",
            ...action.payload,
          })
        );
        break;
      case CLOSE_NOTICE:
        dispatch(closeNotice());
        break;
    }
  };

export default noticeMiddleware;
