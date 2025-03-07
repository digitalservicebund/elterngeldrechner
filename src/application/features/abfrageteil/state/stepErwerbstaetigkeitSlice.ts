import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { YesNo } from "./YesNo";

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
