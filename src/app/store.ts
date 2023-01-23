import { configureStore } from "@reduxjs/toolkit";
import noticeCore from "./reducers.slices/notice.core";
import appMiddleware from "./flows/middleware";
import dialogCore from "./reducers.slices/dialog.core";
import { setupInfra } from "./utils/infra";

const store = configureStore({
  reducer: {
    notice: noticeCore,
    dialogbox: dialogCore,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      ...appMiddleware.map((f: any) => f(setupInfra()))
    ),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store.getState;
export default store;
