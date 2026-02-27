export enum Route {
  Startseite = "/startseite",

  AllgemeineAngaben = "/allgemeine-angaben",

  KindAbfrage = "/kind",
  GeborenesKindAngaben = "/kind/geboren",
  UngeborenesKindAngaben = "/kind/ungeboren",
  WahrscheinlichGeborenesKindAbfrage = "/kind/ungeboren/validierung",

  GeschwisterkindAbfrage = "/geschwisterkind",
  GeschwisterkindAngaben = "/geschwisterkind/:geschwisterIndex",

  ElternteilAllgemeineAngaben = "/elternteil/:elternteilIndex",
  ElternteilAusklammerungGruendeAngaben = "/elternteil/:elternteilIndex/ausklammerung-gruende",
  ElternteilAusklammerungZeitenAngaben = "/elternteil/:elternteilIndex/ausklammerung-zeiten",
  ElternteilTaetigkeitenAbfrage = "/elternteil/:elternteilIndex/taetigkeiten-abfrage",

  ElternteilTaetigkeitAngabenSelbststaendig = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/selbststaendig",
  ElternteilTaetigkeitAngabenMischeinkunft = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/mischeinkunft",
  ElternteilTaetigkeitAngabenNichtSelbststaendig = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/nicht-selbststaendig",
  ElternteilTaetigkeitAngabenMinijob = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/minijob",
  ElternteilTaetigkeitAngabenSozialversicherungen = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/sozialversicherungen",
  ElternteilTaetigkeitAngabenEinkommen = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen",
  ElternteilTaetigkeitAngabenEinkommenDetails = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen/detailliert",
  ElternteilWeitereTaetigkeitAbfrage = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/weitere-taetigkeit",
  ElternteilWeitereTaetigkeitAngaben = "/elternteil/:elternteilIndex/taetigkeit/:taetigkeitIndex/weitere-taetigkeit-angaben",

  ElternteilZweitePersonAngaben = "/elternteil/abfrage-zweite-person",
}
