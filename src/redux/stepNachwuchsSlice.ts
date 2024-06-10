import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stepAllgemeineAngabenActions } from "./stepAllgemeineAngabenSlice";
import { RootState } from "./index";
import { getLebensmonate } from "@/monatsplaner";
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
  (state: RootState) => state.stepNachwuchs,
  (nachwuchs) => {
    const dateString = nachwuchs.wahrscheinlichesGeburtsDatum;
    const [day, month, year] = dateString.split(".");

    return `${year}-${month}-${day}T00:00:00`;
  },
);

export interface LebensmonateAfterBirth {
  monthIsoString: string;
  labelShort: string;
  labelLong: string;
}

const getLebensmonateAfterBirth = createSelector(
  getWahrscheinlichesGeburtsDatum,
  (wahrscheinlichesGeburtsDatum): LebensmonateAfterBirth[] => {
    const lebensmonate = getLebensmonate(wahrscheinlichesGeburtsDatum);
    return lebensmonate.map((month) => ({
      monthIsoString: month.from,
      labelShort: new Date(month.from).toLocaleDateString("de-DE", {
        month: "short",
      }),
      labelLong: new Date(month.from).toLocaleDateString("de-DE", {
        month: "long",
      }),
    }));
  },
);

export const stepNachwuchsSelectors = {
  getWahrscheinlichesGeburtsDatum,
  getLebensmonateAfterBirth,
};
export const stepNachwuchsActions = stepNachwuchsSlice.actions;
export default stepNachwuchsSlice.reducer;
