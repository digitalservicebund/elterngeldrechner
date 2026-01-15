export type BundeslandName = keyof typeof BUNDESLAND_ANTRAG_DATA;
export type Bundesland = (typeof BUNDESLAND_ANTRAG_DATA)[BundeslandName];

export const BUNDESLAND_ANTRAG_DATA = {
  "Baden-Württemberg": {
    name: "Baden-Württemberg",
    isSupported: false,
    link: "https://www.l-bank.de/produkte/familienfoerderung/elterngeld.html",
    linkPDF:
      "https://www.l-bank.de/produkte/familienfoerderung/elterngeld.html#dokumente-und-formulare",
    linkOnlinetool:
      "https://www.l-bank.de/allgemein/familienfoerderung/schritt-fuer-schritt-anleitungen/schritte-zum-elterngeld.html",
  },
  Bayern: {
    name: "Bayern",
    isSupported: false,
    link: "https://www.zbfs.bayern.de/familienleistungen/elterngeld/",
    linkPDF:
      "https://www.zbfs.bayern.de/imperia/md/content/zbfs_intranet/produktgruppe_i/formulare/beeg-antrag/052025_elterngeldantrag_gesamt.pdf",
    linkOnlinetool: "https://www.elterngeld.bayern.de/onlineantrag/",
  },
  Berlin: {
    name: "Berlin",
    isSupported: true,
    link: "https://www.berlin.de/sen/jugend/familie-und-kinder/finanzielle-leistungen/elterngeld-und-elternzeit/",
    linkPDF:
      "https://www.berlin.de/sen/jugend/familie-und-kinder/finanzielle-leistungen/elterngeld-und-elternzeit/",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Brandenburg: {
    name: "Brandenburg",
    isSupported: true,
    link: "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_id=100036807&bus_type=pst&bus_lng=de_DE#",
    linkPDF:
      "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_id=100036807&bus_type=pst&bus_lng=de_DE#",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Bremen: {
    name: "Bremen",
    isSupported: true,
    link: "https://www.service.bremen.de/elterngeld-beantragen-9743",
    linkPDF:
      "https://buergerservice.bremen.de/sixcms/media.php/5/Elterngeldantrag – nur für Geburten ab dem 01.pdf",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Hamburg: {
    name: "Hamburg",
    isSupported: true,
    link: "https://www.hamburg.de/service/info/11981756/n0/",
    linkPDF: "https://www.hamburg.de/service/info/11981756/n0/",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Hessen: {
    name: "Hessen",
    isSupported: false,
    link: "https://familie.hessen.de/familie/geld-fuer-familien/elterngeld",
    linkPDF:
      "https://www.familienatlas.de/themen/geld/finanzielle-hilfen/elterngeld",
    linkOnlinetool:
      "https://elterngeld.hessen.de/elterngeld-onlineantrag/default.aspx ",
  },
  "Mecklenburg-Vorpommern": {
    name: "Mecklenburg-Vorpommern",
    isSupported: false,
    link: "https://www.lagus.mv-regierung.de/Soziales/Elterngeld_ElterngeldPlus/",
    linkPDF:
      "https://www.lagus.mv-regierung.de/Soziales/Elterngeld_ElterngeldPlus/",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Niedersachsen: {
    name: "Niedersachsen",
    isSupported: true,
    link: "https://www.ms.niedersachsen.de/startseite/jugend_familie/familien_kinder_und_jugendliche/familien/elterngeld_elterngeld_plus/das-elterngeld-13791.html",
    linkPDF:
      "https://www.ms.niedersachsen.de/startseite/jugend_familie/familien_kinder_und_jugendliche/familien/elterngeld_elterngeld_plus/das-elterngeld-13791.html",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  "Nordrhein-Westfalen": {
    name: "Nordrhein-Westfalen",
    isSupported: false,
    link: "https://www.familienportal.nrw/de/elterngeld",
    linkPDF: "https://www.familienportal.nrw/de/elterngeld",
    linkOnlinetool: "https://www.familienportal.nrw/de/elterngeld",
  },
  "Rheinland-Pfalz": {
    name: "Rheinland-Pfalz",
    isSupported: true,
    link: "https://mffki.rlp.de/themen/familie/gute-zukunft-fuer-alle-kinder-und-eltern/finanzielle-leistungen/elterngeld",
    linkPDF:
      "https://mffki.rlp.de/themen/familie/gute-zukunft-fuer-alle-kinder-und-eltern/finanzielle-leistungen/elterngeld",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Saarland: {
    name: "Saarland",
    isSupported: true,
    link: "https://www.saarland.de/las/DE/themen/elterngeldstelle/elterngeld_antrag",
    linkPDF:
      "https://www.saarland.de/las/DE/themen/elterngeldstelle/elterngeld_antrag",
    linkOnlinetool:
      "https://service.buergerdienste-saar.de/Elterngeld-Onlineantrag/",
  },
  Sachsen: {
    name: "Sachsen",
    isSupported: true,
    link: "https://amt24.sachsen.de/zufi/leistungen/6000384",
    linkPDF: "https://amt24.sachsen.de/zufi/leistungen/6000384",
    linkOnlinetool:
      "https://www.elterngeld.sachsen.de/Elterngeld-Onlineantrag/",
  },
  "Sachsen-Anhalt": {
    name: "Sachsen-Anhalt",
    isSupported: true,
    link: "https://lvwa.sachsen-anhalt.de/das-lvwa/landesjugendamt/familien-und-frauen/elterngeld-und-elternzeit",
    linkPDF:
      "https://lvwa.sachsen-anhalt.de/das-lvwa/landesjugendamt/familien-und-frauen/elterngeld-und-elternzeit/antragsformulare",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  "Schleswig-Holstein": {
    name: "Schleswig-Holstein",
    isSupported: true,
    link: "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LASG/Aufgaben/KinderUndEltern/Download/BEEG-Formulare?nn=dbac10f9-1f25-4333-ab65-79d1c8ff830e",
    linkPDF:
      "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LASG/Aufgaben/KinderUndEltern/Download/1_EinheitlicherElterngeldantrag?nn=dbac10f9-1f25-4333-ab65-79d1c8ff830e",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
  Thüringen: {
    name: "Thüringen",
    isSupported: true,
    link: "https://landesverwaltungsamt.thueringen.de/soziales/elterngeld/formulare",
    linkPDF:
      "https://landesverwaltungsamt.thueringen.de/soziales/elterngeld/formulare",
    linkOnlinetool: "https://www.elterngeld-digital.de/ams/Elterngeld",
  },
} as const;
