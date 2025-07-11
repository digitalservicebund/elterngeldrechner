export type Bundesland = (typeof bundeslaender)[number];

export const bundeslaender = [
  {
    name: "Baden-Württemberg",
    isSupported: false,
    link: "https://www.l-bank.de/produkte/familienfoerderung/elterngeld.html",
  },
  {
    name: "Bayern",
    isSupported: false,
    link: "https://www.zbfs.bayern.de/familienleistungen/elterngeld/",
  },
  {
    name: "Berlin",
    isSupported: true,
    link: "https://www.berlin.de/sen/jugend/familie-und-kinder/finanzielle-leistungen/elterngeld-und-elternzeit/",
  },
  {
    name: "Brandenburg",
    isSupported: true,
    link: "https://service.brandenburg.de/service/de/verwaltungsleistungen/leistungen-suchen/?bus_id=100036807&bus_type=pst&bus_lng=de_DE#",
  },
  {
    name: "Bremen",
    isSupported: true,
    link: "https://www.service.bremen.de/elterngeld-beantragen-9743",
  },
  {
    name: "Hamburg",
    isSupported: true,
    link: "https://www.hamburg.de/service/info/11981756/n0/",
  },
  {
    name: "Hessen",
    isSupported: false,
    link: "https://familie.hessen.de/familie/geld-fuer-familien/elterngeld",
  },
  {
    name: "Mecklenburg-Vorpommern",
    isSupported: false,
    link: "https://www.lagus.mv-regierung.de/Soziales/Elterngeld_ElterngeldPlus/",
  },
  {
    name: "Niedersachsen",
    isSupported: true,
    link: "https://www.ms.niedersachsen.de/startseite/jugend_familie/familien_kinder_und_jugendliche/familien/elterngeld_elterngeld_plus/das-elterngeld-13791.html",
  },
  {
    name: "Nordrhein-Westfalen",
    isSupported: false,
    link: "https://www.familienportal.nrw/de/elterngeld",
  },
  {
    name: "Rheinland-Pfalz",
    isSupported: true,
    link: "https://mffki.rlp.de/themen/familie/gute-zukunft-fuer-alle-kinder-und-eltern/finanzielle-leistungen/elterngeld",
  },
  {
    name: "Saarland",
    isSupported: true,
    link: "https://www.saarland.de/las/DE/themen/elterngeldstelle/elterngeld_antrag",
  },
  {
    name: "Sachsen",
    isSupported: true,
    link: "https://amt24.sachsen.de/zufi/leistungen/6000384?plz=02625&ags=14625020",
  },
  {
    name: "Sachsen-Anhalt",
    isSupported: false,
    link: "https://lvwa.sachsen-anhalt.de/das-lvwa/landesjugendamt/familien-und-frauen/elterngeld-und-elternzeit",
  },
  {
    name: "Schleswig-Holstein",
    isSupported: true,
    link: "https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LASG/Aufgaben/KinderUndEltern/Download/BEEG-Formulare?nn=dbac10f9-1f25-4333-ab65-79d1c8ff830e",
  },
  {
    name: "Thüringen",
    isSupported: true,
    link: "https://landesverwaltungsamt.thueringen.de/soziales/elterngeld/formulare",
  },
] as const;
