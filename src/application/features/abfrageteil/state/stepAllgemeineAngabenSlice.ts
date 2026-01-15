import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import {
  BUNDESLAND_ANTRAG_DATA,
  BundeslandName,
} from "@/application/features/pdfAntrag";
import { RootState } from "@/application/redux";

export type Antragstellende =
  | "EinenElternteil"
  | "FuerBeide"
  | "FuerBeideUnentschlossen";
type AntragstellendeSelektor = "ET1" | "ET2";

export interface StepAllgemeineAngabenState {
  bundesland: BundeslandName | null;
  antragstellende: Antragstellende | null;
  name: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;
  mutterschutz: YesNo | AntragstellendeSelektor | null;
}

const initialState: StepAllgemeineAngabenState = {
  bundesland: null,
  antragstellende: null,
  name: {
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
  },
});

const getAntragssteller = (state: RootState) =>
  state.stepAllgemeineAngaben.antragstellende === "FuerBeideUnentschlossen"
    ? "FuerBeide"
    : state.stepAllgemeineAngaben.antragstellende;

const getElternteilNames = createSelector(
  (state: RootState) => state.stepAllgemeineAngaben.name.ET1,
  (state: RootState) => state.stepAllgemeineAngaben.name.ET2,
  (nameElternteil1, nameElternteil2) => {
    return {
      ET1: nameElternteil1 || "Elternteil 1",
      ET2: nameElternteil2 || "Elternteil 2",
    };
  },
);

const getBundesland = (state: RootState) => {
  const name = state.stepAllgemeineAngaben.bundesland;

  return name ? BUNDESLAND_ANTRAG_DATA[name] : null;
};

export const stepAllgemeineAngabenSelectors = {
  getAntragssteller,
  getElternteilNames,
  getBundesland,
};
