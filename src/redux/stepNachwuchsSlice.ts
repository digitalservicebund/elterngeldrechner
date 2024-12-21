import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stepAllgemeineAngabenActions } from "./stepAllgemeineAngabenSlice";
import { RootState } from "./index";
import { YesNo } from "@/globals/js/calculations/model";

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

export const initialStepNachwuchsState: StepNachwuchsState = {
  anzahlKuenftigerKinder: 1,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],
  mutterschaftssleistungen: YesNo.NO,
};

type StepNachwuchsPayload = StepNachwuchsState;

const stepNachwuchsSlice = createSlice({
  name: "stepNachwuchs",
  initialState: initialStepNachwuchsState,
  reducers: {
    submitStep: (_, { payload }: PayloadAction<StepNachwuchsPayload>) => {
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
      stepAllgemeineAngabenActions.submitStep,
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
export const stepNachwuchsActions = stepNachwuchsSlice.actions;

export default stepNachwuchsSlice.reducer;

export function parseGermanDateString(germanDateString: string): Date {
  const [day, month, year] = germanDateString.split(".");
  return new Date(
    Date.UTC(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day),
    ),
  );
}
