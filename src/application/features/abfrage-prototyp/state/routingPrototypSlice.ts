import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";

export enum KindPageRoutes {
  ABFRAGE_GEBURT,
  GEBURT_ERFOLGT,
  GEBURT_NICHT_ERFOLGT,
  GEBURT_PLAUSIBILITAETSCHECK,
}

export enum PersonPageRoutes {
  ANGABEN_PERSON,
  AUSKLAMMERUNGS_GRUENDE,
  AUSKLAMMERUNGS_ZEITEN,
  ABFRAGE_TAETIGKEITEN,
  DETAILS_TAETIGKEIT,
  WEITERE_TAETIGKEIT,
}

export interface RoutingPrototypState {
  currentKindPageRoute: KindPageRoutes;
  currentGeschwisterPageRoute: number;
  currentPersonPageRouteET1: PersonPageRoutes;
  currentPersonPageFlowET1: PersonPageFlow;
  currentPersonPageIncomeIndexET1: number;
  currentPersonPageRouteET2: PersonPageRoutes;
  currentPersonPageFlowET2: PersonPageFlow;
  currentPersonPageIncomeIndexET2: number;
}

const initialState: RoutingPrototypState = {
  currentKindPageRoute: KindPageRoutes.ABFRAGE_GEBURT,
  currentGeschwisterPageRoute: 0,
  currentPersonPageRouteET1: PersonPageRoutes.ANGABEN_PERSON,
  currentPersonPageFlowET1: PersonPageFlow.noFlow,
  currentPersonPageIncomeIndexET1: 0,
  currentPersonPageRouteET2: PersonPageRoutes.ANGABEN_PERSON,
  currentPersonPageFlowET2: PersonPageFlow.noFlow,
  currentPersonPageIncomeIndexET2: 0,
};

export const routingPrototypSlice = createSlice({
  name: "routingPrototyp",
  initialState,
  reducers: {
    submitRouting: (_, action: PayloadAction<RoutingPrototypState>) =>
      action.payload,
  },
});
