import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartment } from "ui";
import { appDepartments } from "ui/components/Departments/data";
import { RootState } from "./store";

const initialState: IDepartment[] = appDepartments;

const userSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    setDepartments: (state, action: PayloadAction<IDepartment[]>) => {
      state = [...appDepartments, ...action.payload];
      return state;
    },
  },
});

export const { setDepartments } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDepartment = (state: RootState) => state.departments;

export default userSlice.reducer;
