import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum KindPageRoutes {
  ABFRAGE_GEBURT,
  GEBURT_ERFOLGT,
  GEBURT_NICHT_ERFOLGT,
  GEBURT_PLAUSIBILITAETSCHECK,
}

export enum PersonPageRoutes {
  ANGABEN_PERSON,
  ABFRAGE_TAETIGKEITEN,
  ABFRAGE_AUSKLAMMERUNGEN,
  UEBERSICHT_BMZ,
  ABFRAGE_EINKOMMEN,
}

export interface RoutingPrototypState {
  currentKindPageRoute: KindPageRoutes;
  currentGeschwisterPageRoute: number;
  person1: {
    currentPerson1PageRoute: PersonPageRoutes;
  };
  person2: {
    currentPerson2PageRoute: PersonPageRoutes;
  };
}

const initialState: RoutingPrototypState = {
  currentKindPageRoute: KindPageRoutes.ABFRAGE_GEBURT,
  currentGeschwisterPageRoute: 0,
  person1: {
    currentPerson1PageRoute: PersonPageRoutes.ANGABEN_PERSON,
  },
  person2: {
    currentPerson2PageRoute: PersonPageRoutes.ANGABEN_PERSON,
  },
};

export const routingPrototypSlice = createSlice({
  name: "routingPrototyp",
  initialState,
  reducers: {
    submitRouting: (_, action: PayloadAction<RoutingPrototypState>) =>
      action.payload,
  },
});
