import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import {
  Antragstellende,
  stepAllgemeineAngabenSlice,
} from "./stepAllgemeineAngabenSlice";
import { stepErwerbstaetigkeitSlice } from "./stepErwerbstaetigkeitSlice";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import { StepPrototypState } from "../../abfrage-prototyp/state";
import { Taetigkeit } from "../components/EinkommenForm/Taetigkeit";
import { PersonPageFlow } from "../../abfrage-prototyp/components/PersonPageRouting";

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
  steuerklasse: Steuerklasse | null;
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
  steuerklasse: null,
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

const initialState: StepEinkommenState = {
  ET1: initialStepEinkommenElternteil,
  ET2: initialStepEinkommenElternteil,
  antragstellende: null,
  limitEinkommenUeberschritten: null,
};

export const stepEinkommenSlice = createSlice({
  name: "stepEinkommen",
  initialState,
  reducers: {
    submitStep: (_, action: PayloadAction<StepEinkommenState>) =>
      action.payload,
    migrateFromPrototype(state, action: PayloadAction<StepPrototypState>) {
      const prototype = action.payload;

      state.ET1 = {
        bruttoEinkommenNichtSelbstaendig:
          prototype.ET1.isSelbststaendig ||
          prototype.ET1.hasWeitereTaetigkeiten === YesNo.YES
            ? initialAverageOrMonthlyStateNichtSelbstaendig
            : prototype.ET1.taetigkeiten[0]?.bruttoMonatsschnitt &&
                prototype.ET1.taetigkeiten[0]?.bruttoMonatsschnitt != null
              ? {
                  type: "average",
                  average: prototype.ET1.taetigkeiten[0]?.bruttoMonatsschnitt,
                  perYear: null,
                  perMonth: Array.from<number | null>({ length: 12 }).fill(
                    null,
                  ),
                }
              : {
                  type: "monthly",
                  average: null,
                  perYear: null,
                  perMonth: prototype.ET1.taetigkeiten[0]?.bruttoMonatsangaben
                    ? prototype.ET1.taetigkeiten[0]!.bruttoMonatsangaben
                    : Array.from<number | null>({ length: 12 }).fill(null),
                },
        steuerklasse: prototype.ET1.taetigkeiten.some(
          (taetigkeit) => taetigkeit.steuerklasse,
        )
          ? prototype.ET1.taetigkeiten.find(
              (taetigkeit) => taetigkeit.steuerklasse,
            )!.steuerklasse
          : null,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF0_5,
        gewinnSelbstaendig:
          !prototype.ET1.isSelbststaendig ||
          prototype.ET1.hasWeitereTaetigkeiten === YesNo.YES
            ? initialAverageOrMonthlyStateSelbstaendig
            : {
                type: "yearly",
                average: null,
                perYear: prototype.ET1.taetigkeiten[0]!.bruttoJahresgewinn,
                perMonth: [],
              },
        rentenVersicherung: prototype.ET1.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigRVPflichtversichert,
        )
          ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
          : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
        zahlenSieKirchenSteuer: prototype.ET1.taetigkeiten.some(
          (taetigkeit) => taetigkeit.zahlenSieKirchenSteuer === YesNo.YES,
        )
          ? YesNo.YES
          : YesNo.NO,
        kassenArt: prototype.ET1.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigKVPflichtversichert,
        )
          ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
          : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
        istErwerbstaetig:
          prototype.ET1.isNichtSelbststaendig || prototype.ET1.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO,
        hasMischEinkommen:
          prototype.ET1.taetigkeitenFlow === PersonPageFlow.mischeinkuenfte
            ? YesNo.YES
            : YesNo.NO,
        istSelbststaendig:
          prototype.ET1.isSelbststaendig &&
          !prototype.ET1.isNichtSelbststaendig,
        istNichtSelbststaendig:
          prototype.ET1.isNichtSelbststaendig &&
          !prototype.ET1.isSelbststaendig,
      };
      state.ET2 = {
        bruttoEinkommenNichtSelbstaendig:
          prototype.ET2.isSelbststaendig ||
          prototype.ET2.hasWeitereTaetigkeiten === YesNo.YES
            ? initialAverageOrMonthlyStateNichtSelbstaendig
            : prototype.ET2.taetigkeiten[0]?.bruttoMonatsschnitt &&
                prototype.ET2.taetigkeiten[0]?.bruttoMonatsschnitt != null
              ? {
                  type: "average",
                  average: prototype.ET2.taetigkeiten[0]?.bruttoMonatsschnitt,
                  perYear: null,
                  perMonth: Array.from<number | null>({ length: 12 }).fill(
                    null,
                  ),
                }
              : {
                  type: "monthly",
                  average: null,
                  perYear: null,
                  perMonth: prototype.ET2.taetigkeiten[0]?.bruttoMonatsangaben
                    ? prototype.ET2.taetigkeiten[0].bruttoMonatsangaben
                    : Array.from<number | null>({ length: 12 }).fill(null),
                },
        steuerklasse: prototype.ET2.taetigkeiten.some(
          (taetigkeit) => taetigkeit.steuerklasse,
        )
          ? prototype.ET2.taetigkeiten.find(
              (taetigkeit) => taetigkeit.steuerklasse,
            )!.steuerklasse
          : null,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF0_5,
        gewinnSelbstaendig:
          !prototype.ET2.isSelbststaendig ||
          prototype.ET2.hasWeitereTaetigkeiten === YesNo.YES
            ? initialAverageOrMonthlyStateSelbstaendig
            : {
                type: "yearly",
                average: null,
                perYear: prototype.ET2.taetigkeiten[0]!.bruttoJahresgewinn,
                perMonth: [],
              },
        rentenVersicherung: prototype.ET2.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigRVPflichtversichert === true,
        )
          ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
          : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
        zahlenSieKirchenSteuer: prototype.ET2.taetigkeiten.some(
          (taetigkeit) => taetigkeit.zahlenSieKirchenSteuer === YesNo.YES,
        )
          ? YesNo.YES
          : YesNo.NO,
        kassenArt: prototype.ET2.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigKVPflichtversichert === true,
        )
          ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
          : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
        istErwerbstaetig:
          prototype.ET2.isNichtSelbststaendig || prototype.ET2.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO,
        hasMischEinkommen:
          prototype.ET2.taetigkeitenFlow === PersonPageFlow.mischeinkuenfte
            ? YesNo.YES
            : YesNo.NO,
        istSelbststaendig:
          prototype.ET2.isSelbststaendig &&
          !prototype.ET2.isNichtSelbststaendig,
        istNichtSelbststaendig:
          prototype.ET2.isNichtSelbststaendig &&
          !prototype.ET2.isSelbststaendig,
      };
      state.antragstellende =
        prototype.antragstellende != null
          ? prototype.antragstellende
          : "EinenElternteil";
      state.limitEinkommenUeberschritten =
        prototype.limitEinkommenUeberschritten;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(
  //     stepErwerbstaetigkeitSlice.actions.submitStep,
  //     (state, { payload }) => {
  // const istErwerbstaetigET1: YesNo | null = payload.ET1.vorGeburt;
  // const istErwerbstaetigET2: YesNo | null = payload.ET2.vorGeburt;
  // const hasMischEinkommenET1: YesNo =
  //   payload.ET1.isNichtSelbststaendig && payload.ET1.isSelbststaendig
  //     ? YesNo.YES
  //     : YesNo.NO;
  // const hasMischEinkommenET2: YesNo =
  //   payload.ET2.isNichtSelbststaendig && payload.ET2.isSelbststaendig
  //     ? YesNo.YES
  //     : YesNo.NO;
  // const istNichtSelbststaendigET1 =
  //   payload.ET1.isNichtSelbststaendig === true &&
  //   payload.ET1.isSelbststaendig === false;
  // const istNichtSelbststaendigET2 =
  //   payload.ET2.isNichtSelbststaendig === true &&
  //   payload.ET2.isSelbststaendig === false;
  // const istSelbststaendigET1 =
  //   payload.ET1.isNichtSelbststaendig === false &&
  //   payload.ET1.isSelbststaendig === true;
  // const istSelbststaendigET2 =
  //   payload.ET2.isNichtSelbststaendig === false &&
  //   payload.ET2.isSelbststaendig === true;

  //     const taetigkeitenNichtSelbstaendigUndSelbstaendigET1 =
  //       state.ET1.taetigkeitenNichtSelbstaendigUndSelbstaendig.length > 0
  //         ? state.ET1.taetigkeitenNichtSelbstaendigUndSelbstaendig
  //         : (payload.ET1.isNichtSelbststaendig &&
  //               payload.ET1.isSelbststaendig) ||
  //             payload.ET1.mehrereTaetigkeiten
  //           ? [initialTaetigkeit]
  //           : [];

  //     const et1 =
  //       istErwerbstaetigET1 === YesNo.YES
  //         ? {
  //             ...state.ET1,
  //             istErwerbstaetig: istErwerbstaetigET1,
  //             hasMischEinkommen: hasMischEinkommenET1,
  //             istSelbststaendig: istSelbststaendigET1,
  //             istNichtSelbststaendig: istNichtSelbststaendigET1,
  //             taetigkeitenNichtSelbstaendigUndSelbstaendig:
  //               taetigkeitenNichtSelbstaendigUndSelbstaendigET1,
  //           }
  //         : {
  //             ...resetStepEinkommenElternteil,
  //           };

  //     const taetigkeitenNichtSelbstaendigUndSelbstaendigET2 =
  //       state.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig.length > 0
  //         ? state.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig
  //         : (payload.ET2.isNichtSelbststaendig &&
  //               payload.ET2.isSelbststaendig) ||
  //             payload.ET2.mehrereTaetigkeiten
  //           ? [initialTaetigkeit]
  //           : [];

  //     const et2 =
  //       istErwerbstaetigET2 === YesNo.YES
  //         ? {
  //             ...state.ET2,
  //             istErwerbstaetig: istErwerbstaetigET2,
  //             hasMischEinkommen: hasMischEinkommenET2,
  //             istSelbststaendig: istSelbststaendigET2,
  //             istNichtSelbststaendig: istNichtSelbststaendigET2,
  //             taetigkeitenNichtSelbstaendigUndSelbstaendig:
  //               taetigkeitenNichtSelbstaendigUndSelbstaendigET2,
  //           }
  //         : {
  //             ...resetStepEinkommenElternteil,
  //           };

  //     return {
  //       ...state,
  //       ET1: {
  //         ...et1,
  //       },
  //       ET2: {
  //         ...et2,
  //       },
  //     };
  //   },
  // );
  // builder.addCase(
  //   stepAllgemeineAngabenSlice.actions.submitStep,
  //   (state, { payload }) => {
  //     state.antragstellende = payload.antragstellende;
  //   },
  // );
  // },
});
