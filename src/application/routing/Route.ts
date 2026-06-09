export enum Route {
  Startseite = "/startseite",

  AllgemeineAngaben = "/allgemeine-angaben",

  KindAbfrage = "/kind",
  GeborenesKindAngaben = "/kind/geboren",
  UngeborenesKindAngaben = "/kind/ungeboren",
  WahrscheinlichGeborenesKindAbfrage = "/kind/ungeboren/validierung",

  GeschwisterkindAbfrage = "/geschwisterkind",
  GeschwisterkindAngaben = "/geschwisterkind/:geschwisterIndex",

  ElternteilEinsAllgemeineAngaben = "/elternteil/0",
  ElternteilZweiAllgemeineAngaben = "/elternteil/1",

  ElternteilAusklammerungGruendeAngaben = "/elternteil/:elternteilIndex/ausklammerung/gruende",
  ElternteilAusklammerungZeitenAngaben = "/elternteil/:elternteilIndex/ausklammerung/zeiten",

  ElternteilTaetigkeitenAbfrage = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/abfrage",
  ElternteilTaetigkeitAngabenSelbststaendig = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/selbststaendig",
  ElternteilTaetigkeitAngabenNichtSelbststaendig = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig",
  ElternteilTaetigkeitAngabenMinijob = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/minijob",
  ElternteilTaetigkeitAngabenSozialversicherungen = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/sozialversicherungen",
  ElternteilTaetigkeitAngabenEinkommen = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen",
  ElternteilTaetigkeitAngabenEinkommenDetails = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen/detailliert",
  ElternteilWeitereTaetigkeitAbfrage = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/weitere-taetigkeit",
  ElternteilWeitereTaetigkeitAngaben = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/weitere-taetigkeit-angaben",
}
