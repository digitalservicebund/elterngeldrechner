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
  // ElternteilAusklammerungsgruendeAngaben,
  // ElternteilAusklammerungszeitenAngaben,
  // ElternteilTaetigkeitenAngaben = "/elternteil/:index/taetigkeit/:index",
}
