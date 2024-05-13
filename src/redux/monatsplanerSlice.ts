import {
  changeMonth,
  createElternteile,
  CreateElternteileSettings,
  ElterngeldType,
  Elternteile,
  ElternteilType,
  Month,
} from "../monatsplaner";
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
  partnerMonate: boolean;
  settings: CreateElternteileSettings | undefined;
  elternteile: Elternteile;
}

export const initialMonatsplanerState: MonatsplanerState = {
  mutterschutzElternteil: null,
  settings: undefined,
  // EGR-244 - no conditions to get Partner Monate for only one Elternteil - property default value is true
  partnerMonate: true,
  elternteile: createElternteile({
    mehrlinge: false,
    behindertesGeschwisterkind: false,
    partnerMonate: true,
  }),
};

interface ChangeMonthPayload {
  elternteil: ElternteilType;
  targetType: ElterngeldType;
  partnerMonate: boolean;
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
      (state: MonatsplanerState, { payload }) => {
        if (payload.mutterschaftssleistungen === YesNo.YES) {
          if (payload.antragstellende === "EinElternteil") {
            state.mutterschutzElternteil = "ET1";
          } else {
            state.mutterschutzElternteil = payload.mutterschaftssleistungenWer;
          }
        }

        const partnerMonate =
          payload.alleinerziehend === YesNo.YES ||
          payload.antragstellende === "FuerBeide";

        state.settings = {
          partnerMonate,
          mehrlinge: false,
          behindertesGeschwisterkind: false,
        };
        state.partnerMonate = partnerMonate;
        state.elternteile = createElternteile(state.settings);
      },
    );

    builder.addCase(stepNachwuchsActions.submitStep, (state, { payload }) => {
      const mehrlinge = payload.anzahlKuenftigerKinder > 1;
      const behindertesGeschwisterkind =
        payload.geschwisterkinder.filter((kind) => kind.istBehindert).length >
        0;

      const [day, month, year] =
        payload.wahrscheinlichesGeburtsDatum.split(".");
      const mutterSchutzMonate = numberOfMutterschutzMonths(
        payload.anzahlKuenftigerKinder,
        payload.mutterschaftssleistungen,
      );

      const wahrscheinlichesISOGeburtsDatum = `${year}-${month}-${day}T00:00:00Z`;
      // create suitable configuration for ed-monatsplaner-app API
      const settings = createDefaultElternteileSettings(
        mehrlinge,
        behindertesGeschwisterkind,
        wahrscheinlichesISOGeburtsDatum,
        state.mutterschutzElternteil!,
        mutterSchutzMonate,
        state.partnerMonate,
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
