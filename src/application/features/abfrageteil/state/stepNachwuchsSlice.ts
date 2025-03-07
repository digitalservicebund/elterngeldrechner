import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import { stepAllgemeineAngabenSlice } from "./stepAllgemeineAngabenSlice";
import { RootState } from "@/application/redux";

interface Kind {
  geburtsdatum: string;
  istBehindert: boolean;
}

export interface StepNachwuchsState {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: string;
  geschwisterkinder: Kind[];
  mutterschaftssleistungen: YesNo | null; // from step Allgemeine Angaben set by extraReducers to make code testable
}

const initialState: StepNachwuchsState = {
  anzahlKuenftigerKinder: 1,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],
  mutterschaftssleistungen: YesNo.NO,
};

export const stepNachwuchsSlice = createSlice({
  name: "stepNachwuchs",
  initialState,
  reducers: {
    submitStep: (_, { payload }: PayloadAction<StepNachwuchsState>) => {
      const filteredEmptyGeschwisterkinder = payload.geschwisterkinder.filter(
        (value) => value.geburtsdatum !== "",
      );
      return {
        ...payload,
        geschwisterkinder: filteredEmptyGeschwisterkinder,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepAllgemeineAngabenSlice.actions.submitStep,
      (state, { payload }) => {
        if (payload.mutterschaftssleistungen === YesNo.YES) {
          state.mutterschaftssleistungen = YesNo.YES;
        } else {
          state.mutterschaftssleistungen = YesNo.NO;
        }
      },
    );
  },
});

const getWahrscheinlichesGeburtsDatum = createSelector(
  (state: RootState) => state.stepNachwuchs.wahrscheinlichesGeburtsDatum,
  parseGermanDateString,
);

export const stepNachwuchsSelectors = {
  getWahrscheinlichesGeburtsDatum,
};

export function parseGermanDateString(germanDateString: string): Date {
  const [day, month, year] = germanDateString.split(".");
  return new Date(`${year}-${month}-${day}`);
}
