import { SteuerKlasse } from "../globals/js/calculations/model";

export const preloadedState = {
  stepAllgemeineAngaben: {
    antragstellende: "FuerBeide",
    pseudonym: {
      ET1: "Jasper Darwin Artus",
      ET2: "Salomé Loreley Zoe",
    },
    alleinerziehend: null,
    mutterschaftssleistungen: "NO",
  },
  stepNachwuchs: {
    anzahlKuenftigerKinder: 1,
    wahrscheinlichesGeburtsDatum: "01.04.2024",
    geschwisterkinder: [
      {
        geburtsdatum: "24.10.2019",
        istBehindert: false,
      },
    ],
  },
  stepErwerbstaetigkeit: {
    ET1: {
      vorGeburt: "YES",
      isNichtSelbststaendig: true,
      isSelbststaendig: true,
      sozialVersicherungsPflichtig: "YES",
      monatlichesBrutto: "MehrAlsMiniJob",
    },
    ET2: {
      vorGeburt: "YES",
      isNichtSelbststaendig: true,
      isSelbststaendig: false,
      sozialVersicherungsPflichtig: "YES",
      monatlichesBrutto: "MehrAlsMiniJob",
      mehrereTaetigkeiten: "NO",
    },
  },
  stepEinkommen: {
    limitEinkommenUeberschritten: "NO",
    ET1: {
      bruttoEinkommenNichtSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      steuerKlasse: SteuerKlasse.SKL3,
      splittingFaktor: null,
      kinderFreiBetrag: "1",
      gewinnSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      rentenVersicherung: null,
      zahlenSieKirchenSteuer: "YES",
      kassenArt: "GESETZLICH_PFLICHTVERSICHERT",
      taetigkeitenNichtSelbstaendigUndSelbstaendig: [
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: "YES",
          zeitraum: [
            { from: "1", to: "3" },
            { from: "6", to: "9" },
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig",
          bruttoEinkommenDurchschnitt: 2000,
          isMinijob: "NO",
          zeitraum: [
            { from: "1", to: "5" },
            { from: "10", to: "12" },
          ],
          versicherungen: {
            hasRentenversicherung: true,
            hasArbeitslosenversicherung: false,
            hasKrankenversicherung: true,
            none: false,
          },
        },
      ],
    },
    ET2: {
      bruttoEinkommenNichtSelbstaendig: {
        type: "monthly",
        average: null,
        perMonth: [
          800, 900, 1000, 800, 2000, 1200, 1500, 1300, 1000, 1800, 1600, 2500,
        ],
      },
      steuerKlasse: "1",
      splittingFaktor: null,
      kinderFreiBetrag: "1",
      gewinnSelbstaendig: {
        type: "average",
        average: null,
        perMonth: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
      rentenVersicherung: null,
      zahlenSieKirchenSteuer: "NO",
      kassenArt: "GESETZLICH_PFLICHTVERSICHERT",
      taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
    },
  },
};
