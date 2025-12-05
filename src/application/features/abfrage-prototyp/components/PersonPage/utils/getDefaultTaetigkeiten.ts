import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import {
  TaetigkeitAngaben,
  TaetigkeitUebersicht,
} from "@/application/features/abfrage-prototyp/state/stepPrototypSlice";
import { YesNo } from "@/application/features/abfrageteil/state";

export function getDefaultTaetigkeiten(flow: PersonPageFlow): {
  uebersichtTaetigkeiten: TaetigkeitUebersicht[];
  taetigkeiten: TaetigkeitAngaben[];
} {
  if (flow === PersonPageFlow.mischeinkuenfte) {
    const taetigkeiten: TaetigkeitAngaben[] = [
      {
        taetigkeitenArt: "selbststaendig",

        zahlenSieKirchenSteuer: null,

        selbststaendigKVPflichtversichert: null,
        selbststaendigRVPflichtversichert: null,
        selbststaendigAVPflichtversichert: null,
        bruttoJahresgewinn: null,

        isDurchschnittseinkommen: null,
        bruttoMonatsschnitt: null,
        bruttoMonatsangaben: null,
        isMinijob: null,
        steuerklasse: null,
      },
      {
        taetigkeitenArt: "nichtSelbststaendig",

        zahlenSieKirchenSteuer: null,

        selbststaendigKVPflichtversichert: null,
        selbststaendigRVPflichtversichert: null,
        selbststaendigAVPflichtversichert: null,
        bruttoJahresgewinn: null,

        isDurchschnittseinkommen: null,
        bruttoMonatsschnitt: null,
        bruttoMonatsangaben: null,
        isMinijob: null,
        steuerklasse: null,
      },
    ];

    const uebersichtTaetigkeiten: TaetigkeitUebersicht[] = [
      {
        isActive: YesNo.YES,
        taetigkeitenSelektor: "selbststaendig",
      },
      {
        isActive: YesNo.YES,
        taetigkeitenSelektor: "nichtSelbststaendig",
      },
    ];

    return { uebersichtTaetigkeiten, taetigkeiten };
  } else if (flow === PersonPageFlow.selbststaendig) {
    const taetigkeiten: TaetigkeitAngaben[] = [
      {
        taetigkeitenArt: "selbststaendig",

        zahlenSieKirchenSteuer: null,

        selbststaendigKVPflichtversichert: null,
        selbststaendigRVPflichtversichert: null,
        selbststaendigAVPflichtversichert: null,
        bruttoJahresgewinn: null,

        isDurchschnittseinkommen: null,
        bruttoMonatsschnitt: null,
        bruttoMonatsangaben: null,
        isMinijob: null,
        steuerklasse: null,
      },
    ];

    const uebersichtTaetigkeiten: TaetigkeitUebersicht[] = [
      {
        isActive: YesNo.YES,
        taetigkeitenSelektor: "selbststaendig",
      },
    ];

    return { uebersichtTaetigkeiten, taetigkeiten };
  } else {
    const taetigkeiten: TaetigkeitAngaben[] = [
      {
        taetigkeitenArt: "nichtSelbststaendig",

        zahlenSieKirchenSteuer: null,

        selbststaendigKVPflichtversichert: null,
        selbststaendigRVPflichtversichert: null,
        selbststaendigAVPflichtversichert: null,
        bruttoJahresgewinn: null,

        isDurchschnittseinkommen: null,
        bruttoMonatsschnitt: null,
        bruttoMonatsangaben: null,
        isMinijob: null,
        steuerklasse: null,
      },
    ];

    const uebersichtTaetigkeiten: TaetigkeitUebersicht[] = [
      {
        isActive: YesNo.YES,
        taetigkeitenSelektor: "nichtSelbststaendig",
      },
    ];

    return { uebersichtTaetigkeiten, taetigkeiten };
  }
}
