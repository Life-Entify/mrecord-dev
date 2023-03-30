import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBank } from "ui";
import { RootState } from "./store";

const initialState: IBank[] = [];

const userSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<IBank[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setBanks } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectBank = (state: RootState) => state.banks;

export default userSlice.reducer;
