import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Antragstellende,
  stepAllgemeineAngabenActions,
} from "./stepAllgemeineAngabenSlice";
import { stepErwerbstaetigkeitActions } from "./stepErwerbstaetigkeitSlice";
import { YesNo } from "./yes-no";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner/model";

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

export type Taetigkeit =
  | {
      artTaetigkeit: "NichtSelbststaendig";
      bruttoEinkommenDurchschnitt: number | null;
      isMinijob: YesNo | null;
      zeitraum: Zeitraum[];
      versicherungen: TypeOfVersicherungen;
    }
  | {
      artTaetigkeit: "Selbststaendig";
      gewinneinkuenfte: number | null;
      versicherungen: TypeOfVersicherungen;
    };

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
  ET2: StepEinkommenElternteil;
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
        const istErwerbstaetigET1: YesNo | null = payload.ET1.vorGeburt;
        const istErwerbstaetigET2: YesNo | null = payload.ET2.vorGeburt;
        const hasMischEinkommenET1: YesNo =
          payload.ET1.isNichtSelbststaendig && payload.ET1.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO;
        const hasMischEinkommenET2: YesNo =
          payload.ET2.isNichtSelbststaendig && payload.ET2.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO;
        const istNichtSelbststaendigET1 =
          payload.ET1.isNichtSelbststaendig === true &&
          payload.ET1.isSelbststaendig === false;
        const istNichtSelbststaendigET2 =
          payload.ET2.isNichtSelbststaendig === true &&
          payload.ET2.isSelbststaendig === false;
        const istSelbststaendigET1 =
          payload.ET1.isNichtSelbststaendig === false &&
          payload.ET1.isSelbststaendig === true;
        const istSelbststaendigET2 =
          payload.ET2.isNichtSelbststaendig === false &&
          payload.ET2.isSelbststaendig === true;

        const taetigkeitenNichtSelbstaendigUndSelbstaendigET1 =
          state.ET1.taetigkeitenNichtSelbstaendigUndSelbstaendig.length > 0
            ? state.ET1.taetigkeitenNichtSelbstaendigUndSelbstaendig
            : (payload.ET1.isNichtSelbststaendig &&
                  payload.ET1.isSelbststaendig) ||
                payload.ET1.mehrereTaetigkeiten
              ? [initialTaetigkeit]
              : [];

        const et1 =
          istErwerbstaetigET1 === YesNo.YES
            ? {
                ...state.ET1,
                istErwerbstaetig: istErwerbstaetigET1,
                hasMischEinkommen: hasMischEinkommenET1,
                istSelbststaendig: istSelbststaendigET1,
                istNichtSelbststaendig: istNichtSelbststaendigET1,
                taetigkeitenNichtSelbstaendigUndSelbstaendig:
                  taetigkeitenNichtSelbstaendigUndSelbstaendigET1,
              }
            : {
                ...resetStepEinkommenElternteil,
              };

        const taetigkeitenNichtSelbstaendigUndSelbstaendigET2 =
          state.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig.length > 0
            ? state.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig
            : (payload.ET2.isNichtSelbststaendig &&
                  payload.ET2.isSelbststaendig) ||
                payload.ET2.mehrereTaetigkeiten
              ? [initialTaetigkeit]
              : [];

        const et2 =
          istErwerbstaetigET2 === YesNo.YES
            ? {
                ...state.ET2,
                istErwerbstaetig: istErwerbstaetigET2,
                hasMischEinkommen: hasMischEinkommenET2,
                istSelbststaendig: istSelbststaendigET2,
                istNichtSelbststaendig: istNichtSelbststaendigET2,
                taetigkeitenNichtSelbstaendigUndSelbstaendig:
                  taetigkeitenNichtSelbstaendigUndSelbstaendigET2,
              }
            : {
                ...resetStepEinkommenElternteil,
              };

        return {
          ...state,
          ET1: {
            ...et1,
          },
          ET2: {
            ...et2,
          },
        };
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
