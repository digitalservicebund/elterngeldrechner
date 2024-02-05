import {
  changeMonth,
  createElternteile,
  CreateElternteileSettings,
  ElterngeldType,
  Elternteile,
  ElternteilType,
  Month,
} from "@egr/monatsplaner-app";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stepAllgemeineAngabenActions } from "./stepAllgemeineAngabenSlice";
import { YesNo } from "../globals/js/calculations/model";
import { stepNachwuchsActions } from "./stepNachwuchsSlice";
import { resetStoreAction } from "./resetStoreAction";
import { RootState } from "./index";
import {
  createDefaultElternteileSettings,
  numberOfMutterschutzMonths,
} from "../globals/js/elternteile-utils";

export interface MonatsplanerState {
  mutterschutzElternteil: ElternteilType | null;
  settings: CreateElternteileSettings | undefined;
  elternteile: Elternteile;
}

export const initialMonatsplanerState: MonatsplanerState = {
  mutterschutzElternteil: null,
  settings: undefined,
  elternteile: createElternteile(),
};

interface ChangeMonthPayload {
  elternteil: ElternteilType;
  targetType: ElterngeldType;
  monthIndex: number;
}

export interface SelectedPSBMonthIndices {
  selectableIndices: number[];
  deselectableIndices: number[];
}

const getSelectablePSBMonthIndices = createSelector(
  (state: RootState) => state.monatsplaner.elternteile.ET1.months,
  (state: RootState) =>
    state.monatsplaner.elternteile.remainingMonths.partnerschaftsbonus,
  (months, remainingMonthsPSB): SelectedPSBMonthIndices => {
    const currentPSBIndices = months.flatMap((month, index) =>
      month.type === "PSB" ? [index] : [],
    );
    if (currentPSBIndices.length === 0) {
      return {
        selectableIndices: months.map((_, index) => index),
        deselectableIndices: [],
      };
    }

    const lowestIndex = currentPSBIndices[0];
    const highestIndex = currentPSBIndices[currentPSBIndices.length - 1];

    if (remainingMonthsPSB > 0) {
      return {
        selectableIndices: [lowestIndex - 1, highestIndex + 1],
        deselectableIndices: [lowestIndex, highestIndex],
      };
    } else {
      return {
        selectableIndices: [],
        deselectableIndices: [lowestIndex, highestIndex],
      };
    }
  },
);

export const getAutomaticallySelectedPSBMonthIndex = (
  months: readonly Month[],
  selectedMonthIndex: number,
) => {
  const hasAtLeastOnePSBMonth = months.some((month) => month.type === "PSB");
  if (!hasAtLeastOnePSBMonth) {
    if (selectedMonthIndex === months.length - 1) {
      return selectedMonthIndex - 1;
    } else {
      return selectedMonthIndex + 1;
    }
  }
};

const monatsplanerSlice = createSlice({
  name: "monatsplaner",
  initialState: initialMonatsplanerState,
  reducers: {
    changeMonth: (
      state,
      {
        payload: { elternteil, targetType, monthIndex },
      }: PayloadAction<ChangeMonthPayload>,
    ) => {
      const nextElternteile = changeMonth(
        state.elternteile,
        {
          elternteil,
          targetType,
          monthIndex,
        },
        state.settings,
      );

      return {
        ...state,
        elternteile: nextElternteile,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepAllgemeineAngabenActions.submitStep,
      (state, { payload }) => {
        if (
          payload.antragstellende === "FuerMichSelbst" &&
          payload.alleinerziehend === YesNo.YES &&
          payload.mutterschaftssleistungen === YesNo.YES
        ) {
          state.mutterschutzElternteil = "ET1";
        } else if (payload.mutterschaftssleistungen === YesNo.YES) {
          state.mutterschutzElternteil = payload.mutterschaftssleistungenWer;
        }
      },
    );

    builder.addCase(stepNachwuchsActions.submitStep, (state, { payload }) => {
      const [day, month, year] =
        payload.wahrscheinlichesGeburtsDatum.split(".");
      const mutterSchutzMonate = numberOfMutterschutzMonths(
        payload.anzahlKuenftigerKinder,
        payload.mutterschaftssleistungen,
      );

      const wahrscheinlichesISOGeburtsDatum = `${year}-${month}-${day}T00:00:00Z`;
      // create suitable configuration for ed-monatsplaner-app API
      const settings = createDefaultElternteileSettings(
        wahrscheinlichesISOGeburtsDatum,
        state.mutterschutzElternteil!,
        mutterSchutzMonate,
      );
      return {
        ...state,
        settings,
        elternteile: createElternteile(settings),
      };
    });
    builder.addCase(resetStoreAction, () => {
      return initialMonatsplanerState;
    });
  },
});

export const monatsplanerSelectors = {
  getSelectablePSBMonthIndices,
};
export const monatsplanerActions = monatsplanerSlice.actions;
export default monatsplanerSlice.reducer;
