import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrgBank } from "ui";
import { RootState } from "./store";

const initialState: IOrgBank[] = [];

const bankSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setBanks: (state, action: PayloadAction<IOrgBank[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setBanks } = bankSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectBank = (state: RootState) => state.banks;

export default bankSlice.reducer;
