import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import { StepPrototypState } from "@/application/features/abfrage-prototyp/state";
import { RootState } from "@/application/redux";

export type Antragstellende =
  | "EinenElternteil"
  | "FuerBeide"
  | "FuerBeideUnentschlossen";
type AntragstellendeSelektor = "ET1" | "ET2";

export interface StepAllgemeineAngabenState {
  bundesland: string | null;
  antragstellende: Antragstellende | null;
  pseudonym: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;
  mutterschutz: YesNo | AntragstellendeSelektor | null;
}

const initialState: StepAllgemeineAngabenState = {
  bundesland: null,
  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: "",
  },
  alleinerziehend: null,
  mutterschutz: null,
};

export const stepAllgemeineAngabenSlice = createSlice({
  name: "stepAllgemeineAngaben",
  initialState,
  reducers: {
    submitStep: (_, action: PayloadAction<StepAllgemeineAngabenState>) =>
      action.payload,
    migrateFromPrototype(state, action: PayloadAction<StepPrototypState>) {
      const prototype = action.payload;

      state.bundesland = prototype.familie.bundesland;
      state.antragstellende =
        prototype.antragstellende != null
          ? prototype.antragstellende
          : "EinenElternteil";
      state.pseudonym = {
        ET1: prototype.pseudonym.ET1,
        ET2: prototype.pseudonym.ET2,
      };
      state.alleinerziehend = prototype.alleinerziehend;
      state.mutterschutz =
        prototype.ET1.mutterschutz === "Ja" ||
        prototype.ET1.mutterschutz === "Unentschlossen"
          ? "ET1"
          : prototype.ET2.mutterschutz === "Ja" ||
              prototype.ET2.mutterschutz === "Unentschlossen"
            ? "ET2"
            : YesNo.NO;
    },
  },
});

const getAntragssteller = (state: RootState) =>
  state.stepAllgemeineAngaben.antragstellende === "FuerBeideUnentschlossen"
    ? "FuerBeide"
    : state.stepAllgemeineAngaben.antragstellende;

const getElternteilNames = createSelector(
  (state: RootState) => state.stepAllgemeineAngaben.pseudonym.ET1,
  (state: RootState) => state.stepAllgemeineAngaben.pseudonym.ET2,
  (pseudonymElternteil1, pseudonymElternteil2) => {
    return {
      ET1: pseudonymElternteil1 || "Elternteil 1",
      ET2: pseudonymElternteil2 || "Elternteil 2",
    };
  },
);

const getBundesland = (state: RootState) =>
  state.stepAllgemeineAngaben.bundesland;

export const stepAllgemeineAngabenSelectors = {
  getAntragssteller,
  getElternteilNames,
  getBundesland,
};
