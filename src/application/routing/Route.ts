export enum Route {
  Startseite = "/startseite",

  AllgemeineAngaben = "/allgemeine-angaben",

  KindAbfrage = "/kind",
  GeborenesKindAngaben = "/kind/geboren",
  UngeborenesKindAngaben = "/kind/ungeboren",
  WahrscheinlichGeborenesKindAbfrage = "/kind/ungeboren/validierung",

  GeschwisterkindAbfrage = "/geschwisterkind",
  GeschwisterkindAnzahlAbfrage = "/geschwisterkind/anzahl",
  GeschwisterkindAngaben = "/geschwisterkind/:geschwisterkindIndex",
  GeschwisterbonusUebersicht = "/geschwisterkind/bonus",

  ElternteilEinsAllgemeineAngaben = "/elternteil/0",
  ElternteilGemeinsamePlanungAbfrage = "/elternteil/0/planung-abfrage",
  ElternteilZweiAllgemeineAngaben = "/elternteil/1",

  ElternteilAusklammerungErkrankungAbfrage = "/elternteil/:elternteilIndex/ausklammerung/erkrankung",
  ElternteilAusklammerungErkrankungZeitenAngaben = "/elternteil/:elternteilIndex/ausklammerung/erkrankung-zeiten",
  ElternteilAusklammerungElternzeitAbfrage = "/elternteil/:elternteilIndex/ausklammerung/:geschwisterIndex/elternzeit",
  ElternteilAusklammerungElternzeitZeitenAngaben = "/elternteil/:elternteilIndex/ausklammerung/:geschwisterIndex/elternzeit-zeiten",
  ElternteilAusklammerungMutterschutzAbfrage = "/elternteil/:elternteilIndex/ausklammerung/:geschwisterIndex/mutterschutz",
  ElternteilAusklammerungMutterschutzZeitenAngaben = "/elternteil/:elternteilIndex/ausklammerung/:geschwisterIndex/mutterschutz-zeiten",

  ElternteilTaetigkeitenAbfrage = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/abfrage",
  ElternteilTaetigkeitenBMZUebersicht = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/bmz",
  ElternteilTaetigkeitAngabenSelbststaendig = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/selbststaendig",
  ElternteilTaetigkeitAngabenNichtSelbststaendig = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig",
  ElternteilTaetigkeitAngabenMinijob = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/minijob",
  ElternteilTaetigkeitAngabenSozialversicherungen = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/sozialversicherungen",
  ElternteilTaetigkeitAngabenEinkommen = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen",
  ElternteilTaetigkeitAngabenEinkommenDetails = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/nicht-selbststaendig/einkommen/detailliert",
  ElternteilWeitereTaetigkeitAbfrage = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/weitere-taetigkeit",
  ElternteilWeitereTaetigkeitAngaben = "/elternteil/:elternteilIndex/finanzielles/taetigkeit/:taetigkeitIndex/weitere-taetigkeit-angaben",
}
