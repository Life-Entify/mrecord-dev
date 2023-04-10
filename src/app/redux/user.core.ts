import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dummy } from "components/dummy";
import { IEmployee } from "ui";
import { RootState } from "./store";

let initialState: IEmployee | undefined = dummy.staff[0];

const userSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployee: (state, action: PayloadAction<IEmployee>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setEmployee } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
