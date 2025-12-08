import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { Ausklammerung } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import { YesNo } from "@/application/features/abfrageteil/state";
import { RootState } from "@/application/redux";
import { Steuerklasse } from "@/elterngeldrechner";
import { berechneMutterschutz } from "@/mutterschutzrechner";

interface Kind {
  geburtsdatum: string;
  istBehindert: YesNo | null;
}

export type Antragstellende =
  | "EinenElternteil"
  | "FuerBeide"
  | "FuerBeideUnentschlossen";

export type FamilienAngaben = {
  bundesland: string | null;
  limitEinkommenUeberschritten: YesNo | null;
};

export type KindAngaben = {
  geburtIstErfolgt: YesNo | null;
  anzahlKuenftigerKinder: number;
  errechneterGeburtstermin: string;
  geburtsdatum: string;
};

export type GeschwisterAngaben = {
  esGibtGeschwister: (YesNo | null)[];
  geschwisterkinder: Kind[];
};

export type Mutterschutz = "Ja" | "Nein" | "Unentschlossen";

export type AusklammerungInputs = {
  von: string | null;
  bis: string | null;
};

export type PersonenAngaben = {
  mutterschutz: Mutterschutz | null;

  hasMutterschutzAnderesKind: boolean;
  ausklammerungenMutterschutzAnderesKind: AusklammerungInputs[];
  hasElterngeldAnderesKind: boolean;
  ausklammerungenElterngeldAnderesKind: AusklammerungInputs[];
  hasErkrankung: boolean;
  ausklammerungenErkrankung: AusklammerungInputs[];
  hasKeinGrund: boolean;

  isNichtSelbststaendig: boolean;
  isSelbststaendig: boolean;
  isBeamtet: boolean;
  hasSozialleistungen: boolean;
  hasKeinEinkommen: boolean;

  // keinEinkommenVon: string;
  // keinEinkommenBis: string;
  // sozialleistungenVon: string;
  // sozialleistungenBis: string;

  // hasMutterschutzDiesesKind: boolean;
  // mutterschutzDiesesKindVon: string;
  // mutterschutzDiesesKindBis: string;
  // mutterschutzAnderesKindVon: string;
  // mutterschutzAnderesKindBis: string;
  // elterngeldVon: string;
  // elterngeldBis: string;
  // krankheitVon: string;
  // krankheitBis: string;
  // dienstVon: string;
  // dienstBis: string;

  // taetigkeitenFlow: PersonPageFlow | null;
  // hasWeitereTaetigkeiten: YesNo | null;
  uebersichtTaetigkeiten: TaetigkeitUebersicht[];
  taetigkeiten: TaetigkeitAngaben[];
};

export type TaetigkeitUebersicht = {
  isActive: YesNo | null;
  taetigkeitenSelektor: TaetigkeitenSelektor;
};

export type TaetigkeitAngaben = {
  taetigkeitenArt: TaetigkeitenSelektor;

  zahlenSieKirchenSteuer: YesNo | null;

  selbststaendigKVPflichtversichert: boolean | null;
  selbststaendigRVPflichtversichert: boolean | null;
  selbststaendigAVPflichtversichert: boolean | null;
  bruttoJahresgewinn: number | null;

  isDurchschnittseinkommen: YesNo | null;
  bruttoMonatsschnitt: number | null;
  bruttoMonatsangaben: number[] | null;
  isMinijob: YesNo | null;
  steuerklasse: Steuerklasse | null;
};
export type TaetigkeitenSelektor = "selbststaendig" | "nichtSelbststaendig";

export interface StepPrototypState {
  familie: FamilienAngaben;
  kind: KindAngaben;
  geschwister: GeschwisterAngaben;

  antragstellende: Antragstellende | null;
  pseudonym: {
    ET1: string;
    ET2: string;
  };
  alleinerziehend: YesNo | null;

  ET1: PersonenAngaben;
  ET2: PersonenAngaben;
}

const initialState: StepPrototypState = {
  familie: {
    bundesland: null,
    limitEinkommenUeberschritten: null,
  },
  kind: {
    geburtIstErfolgt: null,
    anzahlKuenftigerKinder: 1,
    errechneterGeburtstermin: "",
    geburtsdatum: "",
  },
  geschwister: {
    esGibtGeschwister: [null],
    geschwisterkinder: [],
  },

  antragstellende: null,
  pseudonym: {
    ET1: "",
    ET2: "",
  },
  alleinerziehend: null,

  ET1: {
    mutterschutz: null,

    hasMutterschutzAnderesKind: false,
    ausklammerungenMutterschutzAnderesKind: [
      {
        von: null,
        bis: null,
      },
    ],
    hasElterngeldAnderesKind: false,
    ausklammerungenElterngeldAnderesKind: [
      {
        von: null,
        bis: null,
      },
    ],
    hasErkrankung: false,
    ausklammerungenErkrankung: [
      {
        von: null,
        bis: null,
      },
    ],
    hasKeinGrund: false,

    isNichtSelbststaendig: false,
    isSelbststaendig: false,
    isBeamtet: false,
    hasSozialleistungen: false,
    hasKeinEinkommen: false,

    uebersichtTaetigkeiten: [],
    taetigkeiten: [],
  },

  ET2: {
    mutterschutz: null,

    hasMutterschutzAnderesKind: false,
    ausklammerungenMutterschutzAnderesKind: [
      {
        von: null,
        bis: null,
      },
    ],
    hasElterngeldAnderesKind: false,
    ausklammerungenElterngeldAnderesKind: [
      {
        von: null,
        bis: null,
      },
    ],
    hasErkrankung: false,
    ausklammerungenErkrankung: [
      {
        von: null,
        bis: null,
      },
    ],
    hasKeinGrund: false,

    isNichtSelbststaendig: false,
    isSelbststaendig: false,
    isBeamtet: false,
    hasSozialleistungen: false,
    hasKeinEinkommen: false,

    uebersichtTaetigkeiten: [],
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

const getBundesland = (state: RootState) =>
  state.stepPrototyp.familie.bundesland;

const getWahrscheinlichesGeburtsDatum = createSelector(
  (state: RootState) =>
    state.stepPrototyp.kind.geburtsdatum.length > 0
      ? state.stepPrototyp.kind.geburtsdatum
      : state.stepPrototyp.kind.errechneterGeburtstermin,
  parseGermanDateString,
);

const getAlleinerziehend = (state: RootState) =>
  state.stepPrototyp.alleinerziehend;

const getMutterschutz = (state: RootState) => {
  if (
    state.stepPrototyp.ET1.mutterschutz === "Ja" ||
    state.stepPrototyp.ET1.mutterschutz === "Unentschlossen"
  ) {
    return "ET1";
  } else if (
    state.stepPrototyp.ET2.mutterschutz === "Ja" ||
    state.stepPrototyp.ET2.mutterschutz === "Unentschlossen"
  ) {
    return "ET2";
  } else {
    return YesNo.NO;
  }
};

const getTaetigkeitenET1 = (state: RootState) =>
  state.stepPrototyp.ET1.taetigkeiten;
const getTaetigkeitenET2 = (state: RootState) =>
  state.stepPrototyp.ET2.taetigkeiten;

const getHasAusklammerungET1 = (state: RootState) =>
  state.stepPrototyp.ET1.hasMutterschutzAnderesKind ||
  state.stepPrototyp.ET1.hasElterngeldAnderesKind ||
  state.stepPrototyp.ET1.hasErkrankung;
const getAusklammerungenET1 = (state: RootState): Ausklammerung[] | [] => {
  const hasMutterschutz =
    state.stepPrototyp.ET1.mutterschutz === "Ja" ||
    state.stepPrototyp.ET1.mutterschutz === "Unentschlossen";
  const { startdatum, enddatum } = berechneMutterschutz(
    parseGermanDateString(state.stepPrototyp.kind.errechneterGeburtstermin),
    state.stepPrototyp.kind.geburtsdatum.length > 0
      ? parseGermanDateString(state.stepPrototyp.kind.geburtsdatum)
      : undefined,
    state.stepPrototyp.geschwister.geschwisterkinder.length > 0,
  );
  const mutterschutz =
    hasMutterschutz && !state.stepPrototyp.ET1.isBeamtet
      ? [
          {
            beschreibung: "Mutterschutz für dieses Kind",
            von: startdatum,
            bis: enddatum,
          },
        ]
      : [];
  const elterngeld = state.stepPrototyp.ET1.ausklammerungenElterngeldAnderesKind
    .filter((item) => item.von && item.bis)
    .map((item) => ({
      beschreibung: "Elterngeld für anderes Kind",
      von: parseGermanDateString(item.von!),
      bis: parseGermanDateString(item.bis!),
    }));
  const mutterschutzAnderesKind =
    state.stepPrototyp.ET1.ausklammerungenMutterschutzAnderesKind
      .filter((item) => item.von && item.bis)
      .map((item) => ({
        beschreibung: "Mutterschutz für anderes Kind",
        von: parseGermanDateString(item.von!),
        bis: parseGermanDateString(item.bis!),
      }));
  const erkrankung = state.stepPrototyp.ET1.ausklammerungenErkrankung
    .filter((item) => item.von && item.bis)
    .map((item) => ({
      beschreibung: "Krankheit wegen der Schwangerschaft",
      von: parseGermanDateString(item.von!),
      bis: parseGermanDateString(item.bis!),
    }));

  return [
    ...mutterschutz,
    ...elterngeld,
    ...mutterschutzAnderesKind,
    ...erkrankung,
  ];
};
const getHasAusklammerungET2 = (state: RootState) =>
  state.stepPrototyp.ET2.hasMutterschutzAnderesKind ||
  state.stepPrototyp.ET2.hasElterngeldAnderesKind ||
  state.stepPrototyp.ET2.hasErkrankung;
const getAusklammerungenET2 = (state: RootState): Ausklammerung[] => {
  const hasMutterschutz =
    state.stepPrototyp.ET2.mutterschutz === "Ja" ||
    state.stepPrototyp.ET2.mutterschutz === "Unentschlossen";
  const { startdatum, enddatum } = berechneMutterschutz(
    parseGermanDateString(state.stepPrototyp.kind.errechneterGeburtstermin),
    state.stepPrototyp.kind.geburtsdatum.length > 0
      ? parseGermanDateString(state.stepPrototyp.kind.geburtsdatum)
      : undefined,
    state.stepPrototyp.geschwister.geschwisterkinder.length > 0,
  );
  const mutterschutz =
    hasMutterschutz && !state.stepPrototyp.ET2.isBeamtet
      ? [
          {
            beschreibung: "Mutterschutz für dieses Kind",
            von: startdatum,
            bis: enddatum,
          },
        ]
      : [];
  const elterngeld = state.stepPrototyp.ET2.ausklammerungenElterngeldAnderesKind
    .filter((item) => item.von && item.bis)
    .map((item) => ({
      beschreibung: "Elterngeld für anderes Kind",
      von: parseGermanDateString(item.von!),
      bis: parseGermanDateString(item.bis!),
    }));
  const mutterschutzAnderesKind =
    state.stepPrototyp.ET2.ausklammerungenMutterschutzAnderesKind
      .filter((item) => item.von && item.bis)
      .map((item) => ({
        beschreibung: "Mutterschutz für anderes Kind",
        von: parseGermanDateString(item.von!),
        bis: parseGermanDateString(item.bis!),
      }));
  const erkrankung = state.stepPrototyp.ET2.ausklammerungenErkrankung
    .filter((item) => item.von && item.bis)
    .map((item) => ({
      beschreibung: "Krankheit wegen der Schwangerschaft",
      von: parseGermanDateString(item.von!),
      bis: parseGermanDateString(item.bis!),
    }));

  return [
    ...mutterschutz,
    ...elterngeld,
    ...mutterschutzAnderesKind,
    ...erkrankung,
  ];
};

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
  getMutterschutz,
  getTaetigkeitenET1,
  getTaetigkeitenET2,
  getHasAusklammerungET1,
  getAusklammerungenET1,
  getHasAusklammerungET2,
  getAusklammerungenET2,
};
