import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "@/application/features/abfrageteil/state";
import { RootState } from "@/application/redux";

interface Kind {
  geburtsdatum: string;
  istBehindert: boolean;
}

export type Antragstellende =
  | "EinenElternteil"
  | "FuerBeide"
  | "FuerBeideUnentschlossen";
type AntragstellendeSelektor = "ET1" | "ET2";

export interface StepPrototypState {
  bundesland: string | null;
  antragstellende: Antragstellende | null;
  pseudonym: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;
  mutterschutz: YesNo | AntragstellendeSelektor | null;

  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: string;
  geschwisterkinder: Kind[];

  limitEinkommenUeberschritten: YesNo | null;
}

const initialState: StepPrototypState = {
  bundesland: null,
  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: "",
  },
  alleinerziehend: null,
  mutterschutz: null,

  anzahlKuenftigerKinder: 1,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],

  limitEinkommenUeberschritten: null,
};

export const stepPrototypSlice = createSlice({
  name: "stepPrototyp",
  initialState,
  reducers: {
    submitStep: (_, action: PayloadAction<StepPrototypState>) => action.payload,
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

const getWahrscheinlichesGeburtsDatum = createSelector(
  (state: RootState) => state.stepNachwuchs.wahrscheinlichesGeburtsDatum,
  parseGermanDateString,
);

export function parseGermanDateString(germanDateString: string): Date {
  const [day, month, year] = germanDateString.split(".");
  return new Date(`${year}-${month}-${day}`);
}

export const stepPrototypSelectors = {
  getAntragssteller,
  getElternteilNames,
  getBundesland,
  getWahrscheinlichesGeburtsDatum,
};
