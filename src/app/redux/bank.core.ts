import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrgBank } from "ui";
import { RootState } from "./store";

const initialState: IOrgBank[] = [];

const userSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<IOrgBank[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setBanks } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectBank = (state: RootState) => state.banks;

export default userSlice.reducer;
