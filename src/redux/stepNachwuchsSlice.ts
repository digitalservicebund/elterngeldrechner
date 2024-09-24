import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stepAllgemeineAngabenActions } from "./stepAllgemeineAngabenSlice";
import { RootState } from "./index";
import { YesNo } from "@/globals/js/calculations/model";
import { fromGermanDateString } from "@/utils/date";

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
  anzahlKuenftigerKinder: 0,
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
  (wahrscheinlichesGeburtsDatum): Date =>
    fromGermanDateString(wahrscheinlichesGeburtsDatum),
);

export interface LebensmonateAfterBirth {
  monthIsoString: string;
  labelShort: string;
  labelLong: string;
}

export const stepNachwuchsSelectors = {
  getWahrscheinlichesGeburtsDatum,
};
export const stepNachwuchsActions = stepNachwuchsSlice.actions;
export default stepNachwuchsSlice.reducer;
