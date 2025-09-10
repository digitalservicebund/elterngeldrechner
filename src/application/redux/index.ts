import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { preloadedState } from "./preloadedState";
import { stepPrototypSlice } from "@/application/features/abfrage-prototyp/state";
import {
  stepAllgemeineAngabenSlice,
  stepEinkommenSlice,
  stepErwerbstaetigkeitSlice,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { feedbackSlice } from "@/application/features/user-feedback";

export const reducers = combineReducers({
  stepAllgemeineAngaben: stepAllgemeineAngabenSlice.reducer,
  stepNachwuchs: stepNachwuchsSlice.reducer,
  stepErwerbstaetigkeit: stepErwerbstaetigkeitSlice.reducer,
  stepEinkommen: stepEinkommenSlice.reducer,
  feedback: feedbackSlice.reducer,
  stepPrototyp: stepPrototypSlice.reducer,
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
