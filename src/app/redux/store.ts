import { configureStore } from "@reduxjs/toolkit";
import deptCore from "./dept.core";

const store = configureStore({
  reducer: {
    departments: deptCore,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store.getState;
export default store;
