import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Zeitraum } from "./stepEinkommenSlice";
import { persoenlicheDatenOfUi } from "./persoenlicheDatenFactory";
import { finanzDatenOfUi } from "./finanzDatenFactory";
import type { RootState } from "./index";
import type { ElternteilType } from "@/globals/js/elternteil-type";
import { MutterschaftsLeistung, YesNo } from "@/globals/js/calculations/model";
import { EgrCalculation } from "@/globals/js/calculations/egr-calculation";
import { EgrSteuerRechner } from "@/globals/js/calculations/brutto-netto-rechner/egr-steuer-rechner";

export interface ElterngeldRow {
  vonLebensMonat: number;
  bisLebensMonat: number;
  basisElternGeld: number;
  elternGeldPlus: number;
  nettoEinkommen: number;
}

type AsyncResult<T> =
  | { state: "init" }
  | { state: "pending" }
  | { state: "error" }
  | { state: "success"; data: T };

export type ElterngeldRowsResult = AsyncResult<ElterngeldRow[]>;

export interface BruttoEinkommenZeitraum {
  bruttoEinkommen: number | null;
  zeitraum: Zeitraum;
}

export const initialBruttoEinkommenZeitraum: BruttoEinkommenZeitraum = {
  bruttoEinkommen: null,
  zeitraum: {
    from: "",
    to: "",
  },
};

export interface StepRechnerElternteilState {
  bruttoEinkommenZeitraum: BruttoEinkommenZeitraum[];
  keinEinkommen: boolean;
  elterngeldResult: ElterngeldRowsResult;
  hasBEGResultChangedDueToPrevFormSteps: boolean;
}

export interface StepRechnerState {
  ET1: StepRechnerElternteilState;
  ET2: StepRechnerElternteilState;
}

const initialStepRechnerElternteilState: StepRechnerElternteilState = {
  bruttoEinkommenZeitraum: [],
  keinEinkommen: false,
  elterngeldResult: { state: "init" },
  hasBEGResultChangedDueToPrevFormSteps: false,
};

export const initialStepRechnerState: StepRechnerState = {
  ET1: initialStepRechnerElternteilState,
  ET2: initialStepRechnerElternteilState,
};

interface CalculateElterngeldPayload {
  elternteil: ElternteilType;
  bruttoEinkommenZeitraum: BruttoEinkommenZeitraum[];
}

interface RecalculateElterngeldPayload extends CalculateElterngeldPayload {
  previousBEGAmount: number | false;
}

const mutterschaftsLeistungOfUi = (
  state: RootState,
  elternteil: ElternteilType,
) => {
  if (
    state.stepAllgemeineAngaben.mutterschaftssleistungen === YesNo.YES &&
    state.stepAllgemeineAngaben.mutterschaftssleistungenWer === elternteil
  ) {
    return state.stepNachwuchs.anzahlKuenftigerKinder > 1
      ? MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_12_WOCHEN
      : MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_8_WOCHEN;
  }

  return MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN;
};

const calculateElterngeld = async (
  state: RootState,
  elternteil: ElternteilType,
  bruttoEinkommenZeitraum: BruttoEinkommenZeitraum[],
): Promise<ElterngeldRow[]> => {
  const bruttoEinkommenZeitraumSanitized = bruttoEinkommenZeitraum.filter(
    (value) => value.bruttoEinkommen !== null && value.bruttoEinkommen > 0,
  );

  const persoenlicheDaten = persoenlicheDatenOfUi(
    state,
    elternteil,
    bruttoEinkommenZeitraumSanitized,
  );
  const finanzDaten = finanzDatenOfUi(
    state,
    elternteil,
    bruttoEinkommenZeitraumSanitized,
  );

  const mutterschaftsLeistung = mutterschaftsLeistungOfUi(state, elternteil);

  const lohnSteuerJahr = EgrSteuerRechner.bestLohnSteuerJahrOf(
    persoenlicheDaten.wahrscheinlichesGeburtsDatum,
  );

  // Wir wissen noch nicht, wann der Nutzer welche Elterngeldart nehmen möchte. Um den Nutzer zu zeigen,
  // wie hoch die Beträge sind, berechnen wir für den gesamten Zeitraum Basiselterngeld und ElterngeldPlus,
  // auch wenn er beides für die gleichen Monate nicht beziehen kann.
  const result = await new EgrCalculation().simulate(
    persoenlicheDaten,
    finanzDaten,
    lohnSteuerJahr,
    mutterschaftsLeistung,
  );

  return result.rows.map(
    (row): ElterngeldRow => ({
      vonLebensMonat: row.vonLebensMonat,
      bisLebensMonat: row.bisLebensMonat,
      basisElternGeld: row.basisElternGeld.toNumber(),
      elternGeldPlus: row.elternGeldPlus.toNumber(),
      nettoEinkommen: row.nettoEinkommen.toNumber(),
    }),
  );
};

const calculateBEG = createAsyncThunk(
  "stepRechner/calculateBEG",
  async (
    { elternteil, bruttoEinkommenZeitraum }: CalculateElterngeldPayload,
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as RootState;

    const rows = await calculateElterngeld(
      state,
      elternteil,
      bruttoEinkommenZeitraum,
    );

    return {
      elternteil,
      bruttoEinkommenZeitraum,
      rows,
    };
  },
);

const recalculateBEG = createAsyncThunk(
  "stepRechner/recalculateBEG",
  async (
    { elternteil, bruttoEinkommenZeitraum }: RecalculateElterngeldPayload,
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as RootState;

    const rows = await calculateElterngeld(
      state,
      elternteil,
      bruttoEinkommenZeitraum,
    );

    /*
    TODO: änderungen in den rows erkennen

    const amountElterngeld = result.elterngeldbasis.toNumber();
    const amountNettoEinkommen = result.netto.toNumber();

    const hasResultChanged =
      !!previousBEGAmount && previousBEGAmount !== amountElterngeld;
*/
    return {
      elternteil,
      bruttoEinkommenZeitraum,
      hasResultChanged: false,
      rows,
    };
  },
);

type SubmitFlagPayload = {
  ET1: boolean;
  ET2: boolean;
};

type ResetFormstepsChangeFlagPayload = {
  elternteil: ElternteilType;
};

const stepRechnerSlice = createSlice({
  name: "stepRechner",
  initialState: initialStepRechnerState,
  reducers: {
    setHasBEGResultChangedDueToPrevFormSteps: (
      state,
      action: PayloadAction<SubmitFlagPayload>,
    ) => {
      const recalculateIfNecessary = (
        changes: boolean,
        state: StepRechnerElternteilState,
      ) =>
        (state.hasBEGResultChangedDueToPrevFormSteps =
          state.elterngeldResult.state !== "init" && changes);

      recalculateIfNecessary(action.payload.ET1, state.ET1);
      recalculateIfNecessary(action.payload.ET2, state.ET2);

      return state;
    },
    resetHasBEGResultChangedDueToPrevFormSteps: (
      state,
      action: PayloadAction<ResetFormstepsChangeFlagPayload>,
    ) => {
      const { elternteil } = action.payload;
      if (elternteil === "ET1") {
        state.ET1.hasBEGResultChangedDueToPrevFormSteps =
          initialStepRechnerState.ET1.hasBEGResultChangedDueToPrevFormSteps;
      }
      if (elternteil === "ET2") {
        state.ET2.hasBEGResultChangedDueToPrevFormSteps =
          initialStepRechnerState.ET2.hasBEGResultChangedDueToPrevFormSteps;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calculateBEG.pending, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = {
        state: "pending",
      };
    });
    builder.addCase(calculateBEG.rejected, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = { state: "error" };
    });
    builder.addCase(
      calculateBEG.fulfilled,
      (state, { payload: { elternteil, bruttoEinkommenZeitraum, rows } }) => {
        state[elternteil].bruttoEinkommenZeitraum = bruttoEinkommenZeitraum;
        state[elternteil].keinEinkommen = bruttoEinkommenZeitraum.length === 0;
        state[elternteil].elterngeldResult = {
          state: "success",
          data: rows,
        };
      },
    );
    builder.addCase(recalculateBEG.pending, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = {
        state: "pending",
      };
    });
    builder.addCase(recalculateBEG.rejected, (state, { meta }) => {
      state[meta.arg.elternteil].elterngeldResult = { state: "error" };
    });
    builder.addCase(
      recalculateBEG.fulfilled,
      (
        state,
        {
          payload: {
            elternteil,
            bruttoEinkommenZeitraum,
            hasResultChanged,
            rows,
          },
        },
      ) => {
        state[elternteil].bruttoEinkommenZeitraum = bruttoEinkommenZeitraum;
        state[elternteil].keinEinkommen = bruttoEinkommenZeitraum.length === 0;
        state[elternteil].elterngeldResult = {
          state: "success",
          data: rows,
        };
        state[elternteil].hasBEGResultChangedDueToPrevFormSteps =
          hasResultChanged;
      },
    );
  },
});

const isMonatsplanerOverlayVisible = (state: RootState) => {
  const antragstellende = state.stepAllgemeineAngaben.antragstellende;
  const stateResultElternteil1 = state.stepRechner.ET1.elterngeldResult.state;
  const stateResultElternteil2 = state.stepRechner.ET2.elterngeldResult.state;

  if (antragstellende === "EinenElternteil") {
    return stateResultElternteil1 !== "success";
  } else {
    return (
      stateResultElternteil1 !== "success" ||
      stateResultElternteil2 !== "success"
    );
  }
};

const hasElterngeldResult = createSelector(
  (state: RootState) => state.stepRechner.ET1.elterngeldResult.state,
  (state: RootState) => state.stepRechner.ET2.elterngeldResult.state,
  (stateResultElternteil1, stateResultElternteil2) => {
    return {
      ET1: stateResultElternteil1 !== "init",
      ET2: stateResultElternteil2 !== "init",
    };
  },
);

export const stepRechnerSelectors = {
  isMonatsplanerOverlayVisible,
  hasElterngeldResult,
};
export const stepRechnerActions = {
  ...stepRechnerSlice.actions,
  calculateBEG,
  recalculateBEG,
};
export default stepRechnerSlice.reducer;
