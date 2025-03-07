import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { configurationSlice } from "./configurationSlice";
import { preloadedState } from "./preloadedState";
import { stepAllgemeineAngabenSlice } from "./stepAllgemeineAngabenSlice";
import { stepEinkommenSlice } from "./stepEinkommenSlice";
import { stepErwerbstaetigkeitSlice } from "./stepErwerbstaetigkeitSlice";
import { stepNachwuchsSlice } from "./stepNachwuchsSlice";
import { feedbackSlice } from "@/application/features/user-feedback";

export const reducers = combineReducers({
  stepAllgemeineAngaben: stepAllgemeineAngabenSlice.reducer,
  stepNachwuchs: stepNachwuchsSlice.reducer,
  stepErwerbstaetigkeit: stepErwerbstaetigkeitSlice.reducer,
  stepEinkommen: stepEinkommenSlice.reducer,
  configuration: configurationSlice.reducer,
  feedback: feedbackSlice.reducer,
});

const store = configureStore({
  reducer: reducers,
  preloadedState:
    import.meta.env.VITE_APP_PRELOAD_STATE === "true"
      ? preloadedState
      : undefined,
});

export default store;

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
