import { combineReducers, configureStore } from "@reduxjs/toolkit";
import configurationReducer from "./configurationSlice";
import { preloadedState } from "./preloadedState";
import stepAllgemeineAngabenReducer from "./stepAllgemeineAngabenSlice";
import stepEinkommenReducer from "./stepEinkommenSlice";
import stepErwerbstaetigkeitReducer from "./stepErwerbstaetigkeitSlice";
import stepNachwuchsReducer from "./stepNachwuchsSlice";
import { feedbackSlice } from "@/application/features/user-feedback";

export const reducers = combineReducers({
  stepAllgemeineAngaben: stepAllgemeineAngabenReducer,
  stepNachwuchs: stepNachwuchsReducer,
  stepErwerbstaetigkeit: stepErwerbstaetigkeitReducer,
  stepEinkommen: stepEinkommenReducer,
  configuration: configurationReducer,
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
