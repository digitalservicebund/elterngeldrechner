export enum ErwerbsTaetigkeit {
  SELBSTSTAENDIG = "SELBSTSTAENDIG",
  NICHT_SELBSTSTAENDIG = "NICHT_SELBSTSTAENDIG",
  MINIJOB = "MINIJOB",
}

// TODO: mark fully readonly
export type MischEkTaetigkeit = {
  readonly erwerbsTaetigkeit: ErwerbsTaetigkeit;
  readonly bruttoEinkommenDurchschnitt: number;
  bruttoEinkommenDurchschnittMidi: number;
  readonly bemessungsZeitraumMonate: boolean[];
  readonly istRentenVersicherungsPflichtig?: boolean;
  readonly istKrankenVersicherungsPflichtig?: boolean;
  readonly istArbeitslosenVersicherungsPflichtig?: boolean;
};
