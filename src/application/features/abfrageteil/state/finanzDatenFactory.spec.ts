import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { finanzDatenOfUi } from "./finanzDatenFactory";
import {
  AverageOrMonthlyState,
  StepEinkommenElternteil,
  Taetigkeit,
  initialAverageOrMonthlyStateNichtSelbstaendig,
} from "./stepEinkommenSlice";
import { INITIAL_STATE } from "@/application/test-utils";
import {
  Einkommen,
  ErwerbsTaetigkeit,
  type FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  type MischEkTaetigkeit,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner";
import { YesNo } from "original-rechner";

describe("finanzDatenFactory", () => {
  it("should create FinanzDaten for ET2 with bruttoEinkommenZeitraumList", () => {
    const bruttoEinkommenZeitraumList = [
      { bruttoEinkommen: 1000, zeitraum: { from: "1", to: "1" } },
    ];

    const finanzDaten = finanzDatenOfUi(
      INITIAL_STATE,
      "ET2",
      bruttoEinkommenZeitraumList,
    );

    expect(finanzDaten.erwerbsZeitraumLebensMonatList.length).toBe(1);
    expect(finanzDaten.erwerbsZeitraumLebensMonatList[0]?.vonLebensMonat).toBe(
      1,
    );
    expect(finanzDaten.erwerbsZeitraumLebensMonatList[0]?.bisLebensMonat).toBe(
      1,
    );
    expect(
      finanzDaten.erwerbsZeitraumLebensMonatList[0]?.bruttoProMonat.value,
    ).toBe(1000);
  });

  it("should create FinanzDaten for ET2 with einkommen vor geburt - kein minijob", () => {
    const state = produce(INITIAL_STATE, (draft) => {
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
      draft.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      };
    });

    const finanzDaten = finanzDatenOfUi(state, "ET2", []);

    expect(finanzDaten.bruttoEinkommen.value).toBe(1000);
  });

  it("should create FinanzDaten for ET2 with average einkommen vor geburt - minijob", () => {
    const state = produce(INITIAL_STATE, (draft) => {
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
      draft.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
      draft.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      };
    });

    const finanzDaten = finanzDatenOfUi(state, "ET2", []);

    expect(finanzDaten.bruttoEinkommen.value).toBe(1000);
  });

  it("should create FinanzDaten for ET2 with monthly einkommen vor geburt - minijob", () => {
    const state = produce(INITIAL_STATE, (draft) => {
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
      draft.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
      draft.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [6000, 6000],
      };
    });

    const finanzDaten = finanzDatenOfUi(state, "ET2", []);

    expect(finanzDaten.bruttoEinkommen.value).toBe(6000);
  });

  it("should create FinanzDaten for ET2 with yearly gewinn vor geburt - minijob", () => {
    const state = produce(INITIAL_STATE, (draft) => {
      draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = false;
      draft.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
      draft.stepErwerbstaetigkeit.ET2.monatlichesBrutto = "MiniJob";
      draft.stepEinkommen.ET2.gewinnSelbstaendig = {
        type: "yearly",
        average: null,
        perYear: 12000,
        perMonth: [],
      };
    });

    const finanzDaten = finanzDatenOfUi(state, "ET2", []);

    expect(finanzDaten.bruttoEinkommen.value).toBe(0);
  });

  describe.each([
    [
      "map initialAverageOrMonthlyState",
      initialAverageOrMonthlyStateNichtSelbstaendig,
      0,
    ],
    [
      "map average null",
      {
        type: "average",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 0",
      {
        type: "average",
        average: 0,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 1000",
      {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map monthly list with nulls",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, null, null, null],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null and 0",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 0],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null 0 and 1000",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 1000],
      } as AverageOrMonthlyState,
      250,
    ],
    [
      "map yearly 12000",
      {
        type: "yearly",
        average: null,
        perYear: 12000,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map yearly null",
      {
        type: "yearly",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map yearly 0",
      {
        type: "yearly",
        average: null,
        perYear: 0,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map yearly 240000",
      {
        type: "yearly",
        average: null,
        perYear: 240000,
        perMonth: [],
      } as AverageOrMonthlyState,
      20000,
    ],
  ])(
    "%s",
    (
      _: string,
      gewinnSelbstaendig: AverageOrMonthlyState,
      finanzDatenBruttoEinkommen: number,
    ) => {
      it("should create FinanzDaten for ET2 with gewinnSelbstaendig", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepErwerbstaetigkeit.ET2.vorGeburt = YesNo.YES;
          draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = false;
          draft.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
          draft.stepEinkommen.ET2.gewinnSelbstaendig = gewinnSelbstaendig;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET2", []);

        expect(finanzDaten.bruttoEinkommen.value).toBe(
          finanzDatenBruttoEinkommen,
        );
      });
    },
  );

  describe.each([
    [
      "map initialAverageOrMonthlyStateNichtSelbstaendig",
      initialAverageOrMonthlyStateNichtSelbstaendig,
      0,
    ],
    [
      "map average null",
      {
        type: "average",
        average: null,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 0",
      {
        type: "average",
        average: 0,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map average 1000",
      {
        type: "average",
        average: 1000,
        perYear: null,
        perMonth: [],
      } as AverageOrMonthlyState,
      1000,
    ],
    [
      "map monthly list with nulls",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, null, null, null],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null and 0",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 0],
      } as AverageOrMonthlyState,
      0,
    ],
    [
      "map monthly list with null 0 and 1000",
      {
        type: "monthly",
        average: null,
        perYear: null,
        perMonth: [null, 0, null, 1000],
      } as AverageOrMonthlyState,
      250,
    ],
  ])(
    "%s",
    (
      _: string,
      bruttoEinkommenNichtSelbstaendig: AverageOrMonthlyState,
      finanzDatenBruttoEinkommen: number,
    ) => {
      it("should create FinanzDaten for ET2 with bruttoEinkommenNichtSelbstaendig", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
          draft.stepErwerbstaetigkeit.ET2.isSelbststaendig = false;
          draft.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig =
            bruttoEinkommenNichtSelbstaendig;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET2", []);

        expect(finanzDaten.bruttoEinkommen.value).toBe(
          finanzDatenBruttoEinkommen,
        );
      });
    },
  );

  describe.each<[string, Taetigkeit[], MischEkTaetigkeit[]]>([
    ["map empty Mischeinkommen list", [], []],
    [
      "map list with one Mischeinkommen",
      [
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: true,
            none: false,
          },
        },
      ],
      [
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 1000,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          istRentenVersicherungsPflichtig: true,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: true,
        },
      ],
    ],
    [
      "map list with 5 Mischeinkommen - contains all kinds of Taetigkeit",
      [
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 1000,
          isMinijob: YesNo.NO,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: true,
            none: false,
          },
        },
        {
          artTaetigkeit: "NichtSelbststaendig",
          bruttoEinkommenDurchschnitt: 300,
          isMinijob: YesNo.YES,
          zeitraum: [{ from: "1", to: "1" }],
          versicherungen: {
            hasRentenversicherung: false,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig",
          gewinneinkuenfte: 6000,
          versicherungen: {
            hasRentenversicherung: false,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig",
          gewinneinkuenfte: 13200,
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
        {
          artTaetigkeit: "Selbststaendig",
          gewinneinkuenfte: 7200,
          versicherungen: {
            hasRentenversicherung: true,
            hasKrankenversicherung: true,
            hasArbeitslosenversicherung: false,
            none: false,
          },
        },
      ],
      [
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 1000,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          istRentenVersicherungsPflichtig: true,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: true,
        },
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.MINIJOB,
          bruttoEinkommenDurchschnitt: 300,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          istRentenVersicherungsPflichtig: false,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: false,
        },
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 500,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: Array<true>(12).fill(true),
          istRentenVersicherungsPflichtig: false,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: false,
        },
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 1100,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: Array<true>(12).fill(true),
          istRentenVersicherungsPflichtig: true,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: false,
        },
        {
          erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 600,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: Array<true>(12).fill(true),
          istRentenVersicherungsPflichtig: true,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: false,
        },
      ],
    ],
  ])("%s", (_, taetigkeitList, mischEkTaetigkeitList) => {
    it("should create FinanzDaten for ET2 with Mischeinkommen", () => {
      const state = produce(INITIAL_STATE, (draft) => {
        draft.stepErwerbstaetigkeit.ET2.vorGeburt = YesNo.YES;
        draft.stepErwerbstaetigkeit.ET2.isNichtSelbststaendig = true;
        draft.stepErwerbstaetigkeit.ET2.isSelbststaendig = true;
        draft.stepEinkommen.ET2.bruttoEinkommenNichtSelbstaendig = {
          type: "average",
          average: 10,
          perYear: null,
          perMonth: [],
        };
        draft.stepEinkommen.ET2.taetigkeitenNichtSelbstaendigUndSelbstaendig =
          taetigkeitList;
      });

      const finanzDaten = finanzDatenOfUi(state, "ET2", []);

      expect(finanzDaten.bruttoEinkommen.value).toBe(0);
      expect(finanzDaten.mischEinkommenTaetigkeiten).toStrictEqual(
        mischEkTaetigkeitList,
      );
    });
  });

  describe.each([
    [null, SteuerKlasse.SKL1],
    [SteuerKlasse.SKL1, SteuerKlasse.SKL1],
    [SteuerKlasse.SKL2, SteuerKlasse.SKL2],
    [SteuerKlasse.SKL3, SteuerKlasse.SKL3],
    [SteuerKlasse.SKL4, SteuerKlasse.SKL4],
    [SteuerKlasse.SKL4_FAKTOR, SteuerKlasse.SKL4_FAKTOR],
    [SteuerKlasse.SKL5, SteuerKlasse.SKL5],
    [SteuerKlasse.SKL6, SteuerKlasse.SKL6],
  ])(
    "when einkommen SteuerKlasse is %s, then finanzDaten Steuerklasse are %s",
    (
      einkommenSteuerKlasse: SteuerKlasse | null,
      finanzDatenSteuerklasse: SteuerKlasse,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1.steuerKlasse = einkommenSteuerKlasse;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten.steuerKlasse).toBe(finanzDatenSteuerklasse);
      });
    },
  );

  describe.each([
    [null, KinderFreiBetrag.ZKF0],
    [KinderFreiBetrag.ZKF0, KinderFreiBetrag.ZKF0],
    [KinderFreiBetrag.ZKF0_5, KinderFreiBetrag.ZKF0_5],
    [KinderFreiBetrag.ZKF1, KinderFreiBetrag.ZKF1],
    [KinderFreiBetrag.ZKF1_5, KinderFreiBetrag.ZKF1_5],
    [KinderFreiBetrag.ZKF2, KinderFreiBetrag.ZKF2],
    [KinderFreiBetrag.ZKF2_5, KinderFreiBetrag.ZKF2_5],
    [KinderFreiBetrag.ZKF3, KinderFreiBetrag.ZKF3],
    [KinderFreiBetrag.ZKF3_5, KinderFreiBetrag.ZKF3_5],
    [KinderFreiBetrag.ZKF4, KinderFreiBetrag.ZKF4],
    [KinderFreiBetrag.ZKF4_5, KinderFreiBetrag.ZKF4_5],
    [KinderFreiBetrag.ZKF5, KinderFreiBetrag.ZKF5],
  ])(
    "when einkommen KinderFreiBetrag is %s, then finanzDaten KinderFreiBetrag are %s",
    (
      einkommenKinderFreiBetrag: KinderFreiBetrag | null,
      finanzDatenKinderFreiBetrag: KinderFreiBetrag,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1.kinderFreiBetrag = einkommenKinderFreiBetrag;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten.kinderFreiBetrag).toBe(finanzDatenKinderFreiBetrag);
      });
    },
  );

  describe.each([
    [null, RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG],
    [
      RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    ],
    [
      RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    ],
  ])(
    "when einkommen RentenArt is %s, then finanzDaten RentenArt are %s",
    (einkommenRentenArt: RentenArt | null, finanzDatenRentenArt: RentenArt) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1.rentenVersicherung = einkommenRentenArt;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten.rentenVersicherung).toBe(finanzDatenRentenArt);
      });
    },
  );

  describe.each([
    [null, KassenArt.GESETZLICH_PFLICHTVERSICHERT],
    [
      KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    ],
    [
      KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    ],
  ])(
    "when einkommen KassenArt is %s, then finanzDaten KassenArt are %s",
    (einkommenKassenArt: KassenArt | null, finanzDatenKassenArt: KassenArt) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1.kassenArt = einkommenKassenArt;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten.kassenArt).toBe(finanzDatenKassenArt);
      });
    },
  );

  describe.each([
    [null, 1],
    [1, 1],
    [2, 2],
    [1.5, 1.5],
  ])(
    "when einkommen splittingFaktor is %s, then finanzDaten splittingFaktor are %s",
    (
      einkommenSplittingFaktor: number | null,
      finanzSplittingFaktor: number,
    ) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1.splittingFaktor = einkommenSplittingFaktor;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten.splittingFaktor).toBe(finanzSplittingFaktor);
      });
    },
  );

  describe.each([
    [
      "map initial ui",
      {
        bruttoEinkommenNichtSelbstaendig:
          initialAverageOrMonthlyStateNichtSelbstaendig,
        steuerKlasse: null,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        gewinnSelbstaendig: initialAverageOrMonthlyStateNichtSelbstaendig,
        rentenVersicherung: null,
        zahlenSieKirchenSteuer: null,
        kassenArt: null,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [],
        istErwerbstaetig: null,
        antragstellende: null,
        hasMischEinkommen: null,
        istSelbststaendig: null,
        istNichtSelbststaendig: null,
      },
      {
        bruttoEinkommen: new Einkommen(0),
        istKirchensteuerpflichtig: false,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        steuerKlasse: SteuerKlasse.SKL1,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      },
    ],
  ])(
    "%s",
    (_: string, einkommen: StepEinkommenElternteil, expected: FinanzDaten) => {
      it("should create FinanzDaten for StepEinkommenElternteil", () => {
        const state = produce(INITIAL_STATE, (draft) => {
          draft.stepEinkommen.ET1 = einkommen;
        });

        const finanzDaten = finanzDatenOfUi(state, "ET1", []);

        expect(finanzDaten).toStrictEqual(expected);
      });
    },
  );
});
