import { combineReducers, configureStore } from "@reduxjs/toolkit";
import monatsplanerReducer from "./monatsplanerSlice";
import stepAllgemeineAngabenReducer from "./stepAllgemeineAngabenSlice";
import stepNachwuchsReducer from "./stepNachwuchsSlice";
import stepErwerbstaetigkeitReducer from "./stepErwerbstaetigkeitSlice";
import stepEinkommenReducer from "./stepEinkommenSlice";
import stepRechnerReducer from "./stepRechnerSlice";
import configurationReducer from "./configurationSlice";
import { preloadedState } from "./preloadedState";

export const reducers = combineReducers({
  monatsplaner: monatsplanerReducer,
  stepAllgemeineAngaben: stepAllgemeineAngabenReducer,
  stepNachwuchs: stepNachwuchsReducer,
  stepErwerbstaetigkeit: stepErwerbstaetigkeitReducer,
  stepEinkommen: stepEinkommenReducer,
  stepRechner: stepRechnerReducer,
  configuration: configurationReducer,
});

const store = configureStore({
  reducer: reducers,
  preloadedState:
    process.env.NODE_ENV === "development"
      ? (preloadedState as any)
      : undefined,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
