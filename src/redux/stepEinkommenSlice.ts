import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import {
  Erwerbstaetigkeiten,
  stepErwerbstaetigkeitActions,
} from "./stepErwerbstaetigkeitSlice";
import {
  stepAllgemeineAngabenActions,
  Antragstellende,
} from "./stepAllgemeineAngabenSlice";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "@/globals/js/calculations/model";
import { ElternteilType } from "@/monatsplaner/elternteile/elternteile-types";

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

interface Einkommen {
  ET1: number;
  ET2: number;
}

const sumBruttoEinkommen = (
  payload: StepEinkommenState,
  elternteil: ElternteilType,
): number => {
  const incomeInputType =
    payload[elternteil].bruttoEinkommenNichtSelbstaendig.type;
  if (incomeInputType === "average") {
    return (
      payload[elternteil].bruttoEinkommenNichtSelbstaendig.average! * 12 || 0
    );
  }
  if (incomeInputType === "monthly") {
    return (
      payload[elternteil].bruttoEinkommenNichtSelbstaendig.perMonth?.reduce(
        (a, b) => a! + b!,
        0,
      ) || 0
    );
  }
  return 0;
};

const sumGewinnEinkommen = (
  payload: StepEinkommenState,
  elternteil: ElternteilType,
): number => {
  const sumGewinnPerYear = payload[elternteil].gewinnSelbstaendig.perYear || 0;
  return sumGewinnPerYear;
};

const sumMischEinkommen = (
  payload: StepEinkommenState,
  elternteil: ElternteilType,
): number => {
  const mischEinkommen = payload[
    elternteil
  ].taetigkeitenNichtSelbstaendigUndSelbstaendig
    .map((period) => {
      const einkommen = period.bruttoEinkommenDurchschnitt!;
      const numOfMonths = period.zeitraum
        .map((zeitraum) => {
          return (
            DateTime.fromISO(zeitraum.to)
              .diff(DateTime.fromISO(zeitraum.from), "months")
              .toObject().months! + 1
          );
        })
        .reduce((a, b) => a! + b!, 0);

      return einkommen * numOfMonths!;
    })
    .reduce((a, b) => a + b, 0);
  return mischEinkommen;
};

const stepEinkommenSlice = createSlice({
  name: "stepEinkommen",
  initialState: initialStepEinkommenState,
  reducers: {
    submitStep: (_, { payload }: PayloadAction<SubmitStepPayload>) => {
      const einkommen: Einkommen = {
        ET1: 0,
        ET2: 0,
      };
      const mischEinkommen: Einkommen = {
        ET1: 0,
        ET2: 0,
      };
      const totalEinkommen: Einkommen = {
        ET1: 0,
        ET2: 0,
      };
      const elternteile: Array<ElternteilType> = ["ET1", "ET2"];
      elternteile.forEach(function (elternteil) {
        if (
          payload[elternteil] &&
          payload[elternteil].istErwerbstaetig === YesNo.YES
        ) {
          if (_[elternteil].istNichtSelbststaendig) {
            einkommen[elternteil] = sumBruttoEinkommen(payload, elternteil);
          }
          if (_[elternteil].istSelbststaendig) {
            einkommen[elternteil] = sumGewinnEinkommen(payload, elternteil);
          }
          if (_[elternteil].hasMischEinkommen) {
            mischEinkommen[elternteil] = sumMischEinkommen(payload, elternteil);
          }
          totalEinkommen[elternteil] =
            _[elternteil].hasMischEinkommen === YesNo.YES
              ? mischEinkommen[elternteil]
              : einkommen[elternteil];
        }
      });
      return {
        ..._,
        ...payload,
      };
    },
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
        const et1 =
          istErwerbstaetigET1 === YesNo.YES
            ? {
                ...state.ET1,
                istErwerbstaetig: istErwerbstaetigET1,
                hasMischEinkommen: hasMischEinkommenET1,
                istSelbststaendig: istSelbststaendigET1,
                istNichtSelbststaendig: istNichtSelbststaendigET1,
              }
            : {
                ...resetStepEinkommenElternteil,
              };
        const et2 =
          istErwerbstaetigET2 === YesNo.YES
            ? {
                ...state.ET2,
                istErwerbstaetig: istErwerbstaetigET2,
                hasMischEinkommen: hasMischEinkommenET2,
                istSelbststaendig: istSelbststaendigET2,
                istNichtSelbststaendig: istNichtSelbststaendigET2,
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
