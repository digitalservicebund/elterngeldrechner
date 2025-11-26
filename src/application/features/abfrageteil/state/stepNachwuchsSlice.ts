import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import { StepPrototypState } from "@/application/features/abfrage-prototyp/state";
import { RootState } from "@/application/redux";

interface Kind {
  geburtsdatum: string;
  istBehindert: boolean;
}

export interface StepNachwuchsState {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: string;
  geschwisterkinder: Kind[];
}

const initialState: StepNachwuchsState = {
  anzahlKuenftigerKinder: 1,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],
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
    migrateFromPrototype(state, action: PayloadAction<StepPrototypState>) {
      const prototype = action.payload;

      state.anzahlKuenftigerKinder = prototype.kind.anzahlKuenftigerKinder;
      state.wahrscheinlichesGeburtsDatum =
        prototype.kind.geburtsdatum.length > 0
          ? prototype.kind.geburtsdatum
          : prototype.kind.errechneterGeburtstermin;
      state.geschwisterkinder = prototype.geschwister.geschwisterkinder.map(
        (kind) => ({
          geburtsdatum: kind.geburtsdatum,
          istBehindert: kind.istBehindert === YesNo.YES,
        }),
      );
    },
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
