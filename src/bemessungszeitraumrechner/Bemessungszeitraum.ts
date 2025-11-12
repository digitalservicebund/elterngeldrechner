import { Ausklammerung } from "./Ausklammerung";
import { Einklammerung } from "./Einklammerung";

export enum ZeitabschnittArt {
  ausklammerung,
  einklammerung,
}

export type Zeitabschnitt =
  | {
      art: ZeitabschnittArt.ausklammerung;
      zeitabschnitt: Ausklammerung;
    }
  | {
      art: ZeitabschnittArt.einklammerung;
      zeitabschnitt: Einklammerung;
    };

export type Bemessungszeitraum = {
  readonly startdatum: Date;
  readonly enddatum: Date;
  readonly zeitabschnitte: Zeitabschnitt[];
};
