import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "@/application/features/abfrageteil/state";
import { RootState } from "@/application/redux";
import { Steuerklasse } from "@/elterngeldrechner";
import { PersonPageFlow } from "../components/PersonPageRouting";

interface Kind {
  geburtsdatum: string;
  istBehindert: boolean;
}

export type Antragstellende =
  | "EinenElternteil"
  | "FuerBeide"
  | "FuerBeideUnentschlossen";
// type AntragstellendeSelektor = "ET1" | "ET2";

export type PersonenAngaben = {
  isNichtSelbststaendig: boolean;
  isSelbststaendig: boolean;
  hasSozialleistungen: boolean;
  hasKeinEinkommen: boolean;

  keinEinkommenVon: string;
  keinEinkommenBis: string;
  sozialleistungenVon: string;
  sozialleistungenBis: string;

  hasMutterschutzDiesesKind: boolean;
  isBeamtet: boolean;
  hasElterngeldAnderesKind: boolean;
  hasMutterschutzAnderesKind: boolean;
  hasErkrankung: boolean;
  hasKeinGrund: boolean;

  mutterschutzDiesesKindVon: string;
  mutterschutzDiesesKindBis: string;
  mutterschutzAnderesKindVon: string;
  mutterschutzAnderesKindBis: string;
  elterngeldVon: string;
  elterngeldBis: string;
  krankheitVon: string;
  krankheitBis: string;
  dienstVon: string;
  dienstBis: string;

  taetigkeitenFlow: PersonPageFlow | null;
  hasWeitereTaetigkeiten: YesNo | null;
  taetigkeiten: TaetigkeitAngaben[];
};

export type TaetigkeitAngaben = {
  taetigkeitenArt: TaetigkeitenSelektor;

  zahlenSieKirchenSteuer: YesNo | null;

  selbststaendigKVPflichtversichert: boolean | null;
  selbststaendigRVPflichtversichert: boolean | null;
  selbststaendigAVPflichtversichert: boolean | null;
  bruttoJahresgewinn: number | null;

  bruttoMonatsschnitt: number | null;
  bruttoMonatsangaben: number[] | null;
  isMinijob: YesNo | null;
  steuerklasse: Steuerklasse | null;
};
export type TaetigkeitenSelektor = "selbststaendig" | "nichtSelbststaendig";

export interface StepPrototypState {
  bundesland: string | null;
  antragstellende: Antragstellende | null;
  pseudonym: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: string;
  geschwisterkinder: Kind[];
  limitEinkommenUeberschritten: YesNo | null;

  ET1: PersonenAngaben;
  ET2: PersonenAngaben;
}

const initialState: StepPrototypState = {
  bundesland: null,
  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: "",
  },
  alleinerziehend: null,
  anzahlKuenftigerKinder: 1,
  wahrscheinlichesGeburtsDatum: "",
  geschwisterkinder: [],
  limitEinkommenUeberschritten: null,

  ET1: {
    isNichtSelbststaendig: false,
    isSelbststaendig: false,
    hasSozialleistungen: false,
    hasKeinEinkommen: false,

    keinEinkommenVon: "",
    keinEinkommenBis: "",
    sozialleistungenVon: "",
    sozialleistungenBis: "",

    hasMutterschutzDiesesKind: false,
    isBeamtet: false,
    hasElterngeldAnderesKind: false,
    hasMutterschutzAnderesKind: false,
    hasErkrankung: false,
    hasKeinGrund: false,

    mutterschutzDiesesKindVon: "",
    mutterschutzDiesesKindBis: "",
    mutterschutzAnderesKindVon: "",
    mutterschutzAnderesKindBis: "",
    elterngeldVon: "",
    elterngeldBis: "",
    krankheitVon: "",
    krankheitBis: "",
    dienstVon: "",
    dienstBis: "",

    taetigkeitenFlow: null,
    hasWeitereTaetigkeiten: null,
    taetigkeiten: [],
  },

  ET2: {
    isNichtSelbststaendig: false,
    isSelbststaendig: false,
    hasSozialleistungen: false,
    hasKeinEinkommen: false,

    keinEinkommenVon: "",
    keinEinkommenBis: "",
    sozialleistungenVon: "",
    sozialleistungenBis: "",

    hasMutterschutzDiesesKind: false,
    isBeamtet: false,
    hasElterngeldAnderesKind: false,
    hasMutterschutzAnderesKind: false,
    hasErkrankung: false,
    hasKeinGrund: false,

    mutterschutzDiesesKindVon: "",
    mutterschutzDiesesKindBis: "",
    mutterschutzAnderesKindVon: "",
    mutterschutzAnderesKindBis: "",
    elterngeldVon: "",
    elterngeldBis: "",
    krankheitVon: "",
    krankheitBis: "",
    dienstVon: "",
    dienstBis: "",

    taetigkeitenFlow: null,
    hasWeitereTaetigkeiten: null,
    taetigkeiten: [],
  },
};

export const stepPrototypSlice = createSlice({
  name: "stepPrototyp",
  initialState,
  reducers: {
    submitStep: (_, action: PayloadAction<StepPrototypState>) => action.payload,
  },
});

const getAntragssteller = (state: RootState) =>
  state.stepPrototyp.antragstellende === "FuerBeideUnentschlossen"
    ? "FuerBeide"
    : state.stepPrototyp.antragstellende;

const getElternteilNames = createSelector(
  (state: RootState) => state.stepPrototyp.pseudonym.ET1,
  (state: RootState) => state.stepPrototyp.pseudonym.ET2,
  (pseudonymElternteil1, pseudonymElternteil2) => {
    return {
      ET1: pseudonymElternteil1 || "Elternteil 1",
      ET2: pseudonymElternteil2 || "Elternteil 2",
    };
  },
);

const getBundesland = (state: RootState) => state.stepPrototyp.bundesland;

const getWahrscheinlichesGeburtsDatum = createSelector(
  (state: RootState) => state.stepPrototyp.wahrscheinlichesGeburtsDatum,
  parseGermanDateString,
);

const getAlleinerziehend = (state: RootState) =>
  state.stepPrototyp.alleinerziehend;

const getTaetigkeitenET1 = (state: RootState) =>
  state.stepPrototyp.ET1.taetigkeiten;
const getTaetigkeitenET2 = (state: RootState) =>
  state.stepPrototyp.ET2.taetigkeiten;

export function parseGermanDateString(germanDateString: string): Date {
  const [day, month, year] = germanDateString.split(".");
  return new Date(`${year}-${month}-${day}`);
}

export const stepPrototypSelectors = {
  getAntragssteller,
  getElternteilNames,
  getBundesland,
  getWahrscheinlichesGeburtsDatum,
  getAlleinerziehend,
  getTaetigkeitenET1,
  getTaetigkeitenET2,
};
