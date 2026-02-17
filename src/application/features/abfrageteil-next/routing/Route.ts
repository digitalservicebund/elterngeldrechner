export enum Route {
  Startseite = "/startseite",

  AllgemeineAngaben = "/allgemeine-angaben",

  KindAbfrage = "/kind",
  GeborenesKindAngaben = "/kind/geboren",
  UngeborenesKindAngaben = "/kind/ungeboren",
  WahrscheinlichGeborenesKindAbfrage = "/kind/ungeboren/validierung",

  GeschwisterkindAbfrage = "/geschwisterkind",
  GeschwisterkindAngaben = "/geschwisterkind/:index",

  ElternteilAllgemeineAngaben = "/elternteil/:index",
  ElternteilAusklammerungGruendeAngaben = "/elternteil/:index/ausklammerung-gruende",
  ElternteilAusklammerungZeitenAngaben = "/elternteil/:index/ausklammerung-zeiten",
  ElternteilTaetigkeitenAbfrage = "/elternteil/:index/taetigkeiten-abfrage",
  // ElternteilTaetigkeitenAngaben = "/elternteil/:index/taetigkeit/:index",
}
