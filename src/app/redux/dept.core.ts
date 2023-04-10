import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment } from "ui";
import { RootState } from "./store";

const initialState: IDepartment[] = [];

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments: (state, action: PayloadAction<IDepartment[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setDepartments } = departmentSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDepartment = (state: RootState) => state.departments;

export default departmentSlice.reducer;
