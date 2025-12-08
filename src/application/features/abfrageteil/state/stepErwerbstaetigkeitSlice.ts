import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";
import { StepPrototypState } from "@/application/features/abfrage-prototyp/state";

export type MonatlichesBrutto = "MiniJob" | "MehrAlsMiniJob";

export interface TypeOfErwerbstaetigkeit {
  isNichtSelbststaendig: boolean;
  isSelbststaendig: boolean;
}

export interface StepErwerbstaetigkeitElternteil
  extends TypeOfErwerbstaetigkeit {
  mehrereTaetigkeiten: YesNo;
  vorGeburt: YesNo | null;
  sozialVersicherungsPflichtig: YesNo | null;
  monatlichesBrutto: MonatlichesBrutto | null;
}

export const initialStepErwerbstaetigkeitElternteil: StepErwerbstaetigkeitElternteil =
  {
    vorGeburt: null,
    isNichtSelbststaendig: false,
    isSelbststaendig: false,
    mehrereTaetigkeiten: YesNo.NO,
    sozialVersicherungsPflichtig: null,
    monatlichesBrutto: null,
  };
export interface StepErwerbstaetigkeitState {
  ET1: StepErwerbstaetigkeitElternteil;
  ET2: StepErwerbstaetigkeitElternteil;
}

const initialState: StepErwerbstaetigkeitState = {
  ET1: initialStepErwerbstaetigkeitElternteil,
  ET2: initialStepErwerbstaetigkeitElternteil,
};

export const stepErwerbstaetigkeitSlice = createSlice({
  name: "stepErwerbstaetigkeit",
  initialState,
  reducers: {
    submitStep: (_, action: PayloadAction<StepErwerbstaetigkeitState>) =>
      action.payload,
    migrateFromPrototype(state, action: PayloadAction<StepPrototypState>) {
      const prototype = action.payload;

      state.ET1 = {
        vorGeburt:
          prototype.ET1.isNichtSelbststaendig || prototype.ET1.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO,
        isNichtSelbststaendig:
          prototype.ET1.isNichtSelbststaendig &&
          !prototype.ET1.isSelbststaendig,
        isSelbststaendig:
          prototype.ET1.isSelbststaendig &&
          !prototype.ET1.isNichtSelbststaendig,
        mehrereTaetigkeiten:
          prototype.ET1.taetigkeiten.length > 1 ? YesNo.YES : YesNo.NO,
        sozialVersicherungsPflichtig: prototype.ET1.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigKVPflichtversichert,
        )
          ? YesNo.YES
          : YesNo.NO,
        monatlichesBrutto:
          prototype.ET1.taetigkeiten.length > 0
            ? prototype.ET1.taetigkeiten.every(
                (taetigkeit) => taetigkeit.isMinijob === YesNo.YES,
              )
              ? "MiniJob"
              : "MehrAlsMiniJob"
            : null,
      };
      state.ET2 = {
        vorGeburt:
          prototype.ET2.isNichtSelbststaendig || prototype.ET2.isSelbststaendig
            ? YesNo.YES
            : YesNo.NO,
        isNichtSelbststaendig:
          prototype.ET2.isNichtSelbststaendig &&
          !prototype.ET2.isSelbststaendig,
        isSelbststaendig:
          prototype.ET2.isSelbststaendig &&
          !prototype.ET2.isNichtSelbststaendig,
        mehrereTaetigkeiten:
          prototype.ET2.taetigkeiten.length > 1 ? YesNo.YES : YesNo.NO,
        sozialVersicherungsPflichtig: prototype.ET2.taetigkeiten.some(
          (taetigkeit) => taetigkeit.selbststaendigKVPflichtversichert,
        )
          ? YesNo.YES
          : YesNo.NO,
        monatlichesBrutto:
          prototype.ET2.taetigkeiten.length > 0
            ? prototype.ET2.taetigkeiten.every(
                (taetigkeit) => taetigkeit.isMinijob === YesNo.YES,
              )
              ? "MiniJob"
              : "MehrAlsMiniJob"
            : null,
      };
    },
  },
});

const isErwerbstaetigVorGeburt = (state: StepErwerbstaetigkeitElternteil) => {
  return state.vorGeburt === YesNo.YES;
};
const hasAnyTypeOfSelbstaendigkeit = (state: StepErwerbstaetigkeitElternteil) =>
  state.vorGeburt === YesNo.YES && state.isSelbststaendig;

const isOnlyErwerbstaetig = (state: StepErwerbstaetigkeitElternteil) => {
  return (
    state.vorGeburt === YesNo.YES &&
    state.isNichtSelbststaendig &&
    !hasAnyTypeOfSelbstaendigkeit(state)
  );
};

const isOnlySelbstaendig = (state: StepErwerbstaetigkeitElternteil) => {
  return (
    state.vorGeburt === YesNo.YES &&
    !state.isNichtSelbststaendig &&
    hasAnyTypeOfSelbstaendigkeit(state)
  );
};

const isSelbstaendigOrNoMiniJob = (state: StepErwerbstaetigkeitElternteil) => {
  return (
    state.vorGeburt === YesNo.YES &&
    (hasAnyTypeOfSelbstaendigkeit(state) ||
      state.monatlichesBrutto !== "MiniJob")
  );
};

const isSelbstaendigAndErwerbstaetig = (
  state: StepErwerbstaetigkeitElternteil,
) => {
  return (
    state.vorGeburt === YesNo.YES &&
    state.isNichtSelbststaendig &&
    hasAnyTypeOfSelbstaendigkeit(state)
  );
};

export const stepErwerbstaetigkeitElternteilSelectors = {
  isErwerbstaetigVorGeburt,
  isOnlyErwerbstaetig,
  isOnlySelbstaendig,
  isSelbstaendigOrNoMiniJob,
  isSelbstaendigAndErwerbstaetig,
};
