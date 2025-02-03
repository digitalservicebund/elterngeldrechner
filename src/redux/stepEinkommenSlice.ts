import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Antragstellende,
  stepAllgemeineAngabenActions,
} from "./stepAllgemeineAngabenSlice";
import {
  Erwerbstaetigkeiten,
  stepErwerbstaetigkeitActions,
} from "./stepErwerbstaetigkeitSlice";
import { YesNo } from "./yes-no";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

export interface Zeitraum {
  from: string;
  to: string;
}
export interface TypeOfVersicherungen {
  hasRentenversicherung: boolean;
  hasKrankenversicherung: boolean;
  hasArbeitslosenversicherung: boolean;
  none: boolean;
}

export interface Taetigkeit {
  artTaetigkeit: Erwerbstaetigkeiten | null;
  bruttoEinkommenDurchschnitt: number | null;
  isMinijob: YesNo | null;
  zeitraum: Zeitraum[];
  versicherungen: TypeOfVersicherungen;
}

export interface AverageOrMonthlyState {
  type: "average" | "monthly" | "yearly";
  average: number | null;
  perYear: number | null;
  perMonth: (number | null)[];
}

export const initialAverageOrMonthlyStateNichtSelbstaendig: AverageOrMonthlyState =
  {
    type: "average",
    average: null,
    perYear: null,
    perMonth: Array.from<number | null>({ length: 12 }).fill(null),
  };

const initialAverageOrMonthlyStateSelbstaendig: AverageOrMonthlyState = {
  type: "yearly",
  average: null,
  perYear: null,
  perMonth: [],
};

export interface StepEinkommenElternteil {
  bruttoEinkommenNichtSelbstaendig: AverageOrMonthlyState;
  steuerKlasse: SteuerKlasse | null;
  splittingFaktor: number | null;
  kinderFreiBetrag: KinderFreiBetrag | null;
  gewinnSelbstaendig: AverageOrMonthlyState;
  rentenVersicherung: RentenArt | null;
  zahlenSieKirchenSteuer: YesNo | null;
  kassenArt: KassenArt | null;
  taetigkeitenNichtSelbstaendigUndSelbstaendig: Taetigkeit[];
  istErwerbstaetig: YesNo | null;
  hasMischEinkommen: YesNo | null;
  istSelbststaendig: boolean | null;
  istNichtSelbststaendig: boolean | null;
}

export const initialTaetigkeit: Taetigkeit = {
  artTaetigkeit: "NichtSelbststaendig",
  bruttoEinkommenDurchschnitt: null,
  isMinijob: null,
  zeitraum: [
    {
      from: "",
      to: "",
    },
  ],
  versicherungen: {
    hasRentenversicherung: false,
    hasArbeitslosenversicherung: false,
    hasKrankenversicherung: false,
    none: false,
  },
};

const initialStepEinkommenElternteil: StepEinkommenElternteil = {
  bruttoEinkommenNichtSelbstaendig:
    initialAverageOrMonthlyStateNichtSelbstaendig,
  steuerKlasse: null,
  splittingFaktor: null,
  kinderFreiBetrag: KinderFreiBetrag.ZKF1,
  gewinnSelbstaendig: initialAverageOrMonthlyStateSelbstaendig,
  rentenVersicherung: null,
  zahlenSieKirchenSteuer: null,
  kassenArt: null,
  taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
  istErwerbstaetig: null,
  hasMischEinkommen: null,
  istSelbststaendig: null,
  istNichtSelbststaendig: null,
};

const resetStepEinkommenElternteil: StepEinkommenElternteil = {
  ...initialStepEinkommenElternteil,
  istErwerbstaetig: YesNo.NO,
};

export interface StepEinkommenState {
  ET1: StepEinkommenElternteil;
  ET2?: StepEinkommenElternteil;
  antragstellende: Antragstellende | null;
  limitEinkommenUeberschritten: YesNo | null;
}

export const initialStepEinkommenState: StepEinkommenState = {
  ET1: initialStepEinkommenElternteil,
  ET2: initialStepEinkommenElternteil,
  antragstellende: null,
  limitEinkommenUeberschritten: null,
};

type SubmitStepPayload = StepEinkommenState;

const stepEinkommenSlice = createSlice({
  name: "stepEinkommen",
  initialState: initialStepEinkommenState,
  reducers: {
    submitStep: (_, { payload }: PayloadAction<SubmitStepPayload>) => payload,
  },
  extraReducers: (builder) => {
    builder.addCase(
      stepErwerbstaetigkeitActions.submitStep,
      (state, { payload }) => {
        state.ET1 =
          payload.ET1.vorGeburt === YesNo.YES
            ? {
                ...state.ET1,
                istErwerbstaetig: payload.ET1.vorGeburt,
                hasMischEinkommen:
                  payload.ET1.isNichtSelbststaendig &&
                  payload.ET1.isSelbststaendig
                    ? YesNo.YES
                    : YesNo.NO,
                istSelbststaendig:
                  payload.ET1.isNichtSelbststaendig === false &&
                  payload.ET1.isSelbststaendig === true,
                istNichtSelbststaendig:
                  payload.ET1.isNichtSelbststaendig === true &&
                  payload.ET1.isSelbststaendig === false,
                taetigkeitenNichtSelbstaendigUndSelbstaendig:
                  payload.ET1.isNichtSelbststaendig &&
                  payload.ET1.isSelbststaendig
                    ? [initialTaetigkeit]
                    : [],
              }
            : { ...resetStepEinkommenElternteil };

        if (payload.ET2) {
          state.ET2 =
            payload.ET2.vorGeburt === YesNo.YES
              ? {
                  ...state.ET2!,
                  istErwerbstaetig: payload.ET2.vorGeburt,
                  hasMischEinkommen:
                    payload.ET2.isNichtSelbststaendig &&
                    payload.ET2.isSelbststaendig
                      ? YesNo.YES
                      : YesNo.NO,
                  istSelbststaendig:
                    payload.ET2.isNichtSelbststaendig === false &&
                    payload.ET2.isSelbststaendig === true,
                  istNichtSelbststaendig:
                    payload.ET2.isNichtSelbststaendig === true &&
                    payload.ET2.isSelbststaendig === false,
                  taetigkeitenNichtSelbstaendigUndSelbstaendig:
                    payload.ET2.isNichtSelbststaendig &&
                    payload.ET2.isSelbststaendig
                      ? [initialTaetigkeit]
                      : [],
                }
              : { ...resetStepEinkommenElternteil };
        }
      },
    );
    builder.addCase(
      stepAllgemeineAngabenActions.submitStep,
      (state, { payload }) => {
        state.antragstellende = payload.antragstellende;
      },
    );
  },
});

export const stepEinkommenActions = stepEinkommenSlice.actions;
export default stepEinkommenSlice.reducer;
