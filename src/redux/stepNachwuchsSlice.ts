import { getLebensmonate } from "../monatsplaner";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectOption } from "../components/molecules";
import { RootState } from "./index";
import { stepAllgemeineAngabenActions } from "./stepAllgemeineAngabenSlice";
import { YesNo } from "../globals/js/calculations/model";

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

const monthAfterBirthDateFormat = new Intl.DateTimeFormat("de-DE", {
  month: "long",
  year: "numeric",
});

const getMonthValue = (wahrscheinlichesGeburtsDatum: string, i: number) => {
  const month = new Date(wahrscheinlichesGeburtsDatum);
  // Der Tag wird auf 1 gesetzt bevor der Monat erhöht wird.
  // Das ist notwendig, damit der Monat bei Tag 29, 30 oder 31 nicht
  // um einen weiteren Monat und somit um 2 Monate erhöht wird.
  month.setDate(1);
  month.setMonth(month.getMonth() + i);
  const monthIsoString = new Date(
    Date.UTC(month.getFullYear(), month.getMonth(), month.getDate()),
  )
    .toISOString()
    .split("T")[0];
  return { monthIsoString, month };
};

const getMonthsLastYearBeforeBirthOptions = createSelector(
  getWahrscheinlichesGeburtsDatum,
  (wahrscheinlichesGeburtsDatum): SelectOption[] => {
    const birthday = new Date(wahrscheinlichesGeburtsDatum);
    const firstMonthAtBirthYear = new Date(
      Date.UTC(birthday.getFullYear(), 0, 1),
    ).toISOString();
    const months = [];
    for (let i = 1; i < 13; i++) {
      const { monthIsoString, month: monthBeforeBirth } = getMonthValue(
        firstMonthAtBirthYear,
        -i,
      );

      months.push({
        label: monthAfterBirthDateFormat.format(monthBeforeBirth),
        value: monthIsoString,
      });
    }

    return months;
  },
);

const getMonthsAfterBirthOptions = createSelector(
  getWahrscheinlichesGeburtsDatum,
  (wahrscheinlichesGeburtsDatum): SelectOption[] => {
    const months = [];
    for (let i = 0; i < 32; i++) {
      const { monthIsoString } = getMonthValue(wahrscheinlichesGeburtsDatum, i);

      months.push({
        label: `${i + 1}`,
        value: monthIsoString,
      });
    }

    return months;
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
  getMonthsAfterBirthOptions,
  getMonthsLastYearBeforeBirthOptions,
};
export const stepNachwuchsActions = stepNachwuchsSlice.actions;
export default stepNachwuchsSlice.reducer;
