import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import { YesNo } from "@/globals/js/calculations/model";

export type Antragstellende = "EinenElternteil" | "FuerBeide";
type AntragstellendeSelektor = "ET1" | "ET2";

export interface StepAllgemeineAngabenState {
  antragstellende: Antragstellende | null;
  pseudonym: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;
  mutterschaftssleistungen: YesNo | null;
  mutterschaftssleistungenWer: AntragstellendeSelektor | null;
}

export const initialStepAllgemeineAngabenState: StepAllgemeineAngabenState = {
  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: "",
  },
  alleinerziehend: null,
  mutterschaftssleistungen: null,
  mutterschaftssleistungenWer: null,
};

type SubmitStepPayload = StepAllgemeineAngabenState;

const stepAllgemeineAngabenSlice = createSlice({
  name: "stepAllgemeineAngaben",
  initialState: initialStepAllgemeineAngabenState,
  reducers: {
    submitStep: (_, action: PayloadAction<SubmitStepPayload>) => {
      const alleinerziehend =
        action.payload.antragstellende === "FuerBeide"
          ? null
          : action.payload.alleinerziehend;
      return {
        ...action.payload,
        alleinerziehend,
      };
    },
  },
});

const getAntragssteller = (state: RootState) =>
  state.stepAllgemeineAngaben.antragstellende;

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

const getAlleinerziehend = (state: RootState) =>
  state.stepAllgemeineAngaben.alleinerziehend;

export const stepAllgemeineAngabenActions = stepAllgemeineAngabenSlice.actions;
export default stepAllgemeineAngabenSlice.reducer;
export const stepAllgemeineAngabenSelectors = {
  getAntragssteller,
  getElternteilNames,
  getAlleinerziehend,
};
