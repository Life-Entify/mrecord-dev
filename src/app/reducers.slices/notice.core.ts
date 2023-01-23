import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface NoticeState {
  open: boolean;
  message: any;
  type: string | undefined;
  onClose?: Function | undefined;
  duration?: number;
}
export type DisplayNoticeState = Pick<NoticeState, "type" | "message">;
const initialState: NoticeState = {
  open: false,
  message: "",
  type: undefined,
  onClose: undefined,
  duration: 600,
};
export type NoticePayload = Omit<NoticeState, "open">;

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    displayNotice: (state, action: PayloadAction<NoticePayload>) => {
      state = {
        onClose: undefined,
        open: true,
        ...action.payload,
      };
      return state;
    },
    closeNotice: (state) => {
      state = { ...initialState };
      return state;
    },
  },
});

export const { displayNotice, closeNotice } = noticeSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectNotice = (state: RootState) => state.notice;

export default noticeSlice.reducer;
