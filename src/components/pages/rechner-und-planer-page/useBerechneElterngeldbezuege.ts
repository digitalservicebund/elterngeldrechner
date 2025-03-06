import { useCallback, useRef } from "react";
import { calculateElternGeld } from "@/elterngeldrechner/egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldDaten,
  type ElternGeldPlusErgebnis,
  type ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  MutterschaftsLeistung,
  type PersoenlicheDaten,
  type PlanungsDaten,
} from "@/elterngeldrechner/model";
import {
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  type ElterngeldbezuegeFuerElternteil,
  Elternteil,
  KeinElterngeld,
  Lebensmonatszahlen,
  type Monat,
  Variante,
  isVariante,
} from "@/monatsplaner";
import type { RootState } from "@/redux";
import type { ElternteilType } from "@/redux/elternteil-type";
import { finanzDatenOfUi } from "@/redux/finanzDatenFactory";
import { useAppStore } from "@/redux/hooks";
import { persoenlicheDatenOfUi } from "@/redux/persoenlicheDatenFactory";

export function useBerechneElterngeldbezuege(): BerechneElterngeldbezuegeCallback {
  const store = useAppStore();
  const parameter = useRef(createStaticCalculationParameter(store.getState()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    berechneElterngeldbezuege.bind(null, parameter.current),
    [],
  );
}

function createStaticCalculationParameter(
  state: RootState,
): StaticCalculationParameter {
  return {
    [Elternteil.Eins]: createStaticCalculationParameterForElternteil(
      state,
      "ET1",
    ),
    [Elternteil.Zwei]: createStaticCalculationParameterForElternteil(
      state,
      "ET2",
    ),
  };
}

function berechneElterngeldbezuege(
  staticParameter: StaticCalculationParameter,
  elternteil: Elternteil,
  monate: GeplanteMonate,
): ElterngeldbezuegeFuerElternteil {
  const elterngelddaten = buildParameterForCalculation(
    staticParameter[elternteil],
    monate,
  );

  const ergebnis = calculateElternGeld(elterngelddaten);
  return elterngeldbezuegeFrom(ergebnis);
}

function buildParameterForCalculation(
  staticParameter: StaticCalculationParameterForElternteil,
  monate: GeplanteMonate,
): ElternGeldDaten {
  const { persoenlicheDaten, finanzdaten } = staticParameter;

  const monateMitErwerbstaetigkeit = transformMonateForFinanzdaten(monate);
  const planungsdaten = transformMonateToPlanungsdaten(monate);

  /*
   * Attention:
   * Parameters are not cloned but the same memory is manipulated on every
   * calculation. This is effective as this algorithm runs over and over again.
   * Though, you need to be mindful about this. For example in testing.
   */
  persoenlicheDaten.hasEtNachGeburt = monateMitErwerbstaetigkeit.length > 0;
  finanzdaten.erwerbsZeitraumLebensMonatList = monateMitErwerbstaetigkeit;

  return {
    persoenlicheDaten,
    finanzDaten: finanzdaten,
    planungsDaten: planungsdaten,
  };
}

function transformMonateForFinanzdaten(
  monate: GeplanteMonate,
): ErwerbsZeitraumLebensMonat[] {
  return Object.entries(monate)
    .filter(isEntryWithDefinedMonthValue)
    .filter(isEntryWithRelevantEinkommen)
    .map(([lebensmonatszahl, monat]) => ({
      vonLebensMonat: Number.parseInt(lebensmonatszahl),
      bisLebensMonat: Number.parseInt(lebensmonatszahl),
      bruttoProMonat: new Einkommen(monat.bruttoeinkommen),
    }));
}

function transformMonateToPlanungsdaten(monate: GeplanteMonate): PlanungsDaten {
  return {
    mutterschaftsLeistung: MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN, // Does not matter.
    planung: Lebensmonatszahlen.map((lebensmonatszahl) =>
      elterngeldartFrom(monate[lebensmonatszahl]?.gewaehlteOption),
    ),
  };
}

function elterngeldbezuegeFrom(
  ergebnis: ElternGeldPlusErgebnis,
): ElterngeldbezuegeFuerElternteil {
  return ergebnis.elternGeldAusgabe.reduce(
    (elterngeldbezuege, ausgabe) => ({
      ...elterngeldbezuege,
      [ausgabe.lebensMonat]: ausgabe.elternGeld,
    }),
    {},
  );
}

function isEntryWithDefinedMonthValue<Key>(
  entry: [Key, Monat | undefined],
): entry is [Key, Monat] {
  return entry[1] !== undefined;
}

function isEntryWithRelevantEinkommen<Key>(
  entry: [Key, Monat],
): entry is [Key, Monat & { bruttoeinkommen: number }] {
  const monat = entry[1];
  return isVariante(monat.gewaehlteOption) && !!monat.bruttoeinkommen;
}

function elterngeldartFrom(option?: Auswahloption): ElternGeldArt {
  switch (option) {
    case Variante.Basis:
      return ElternGeldArt.BASIS_ELTERNGELD;

    case Variante.Plus:
    case Variante.Bonus:
      return ElternGeldArt.ELTERNGELD_PLUS;

    case KeinElterngeld:
    case undefined:
      return ElternGeldArt.KEIN_BEZUG;
  }
}

function createStaticCalculationParameterForElternteil(
  state: RootState,
  elternteil: ElternteilType,
): StaticCalculationParameterForElternteil {
  const persoenlicheDaten = persoenlicheDatenOfUi(state, elternteil);
  const finanzdaten = finanzDatenOfUi(state, elternteil, []);
  return {
    persoenlicheDaten,
    finanzdaten,
  };
}

type StaticCalculationParameter = Record<
  Elternteil,
  StaticCalculationParameterForElternteil
>;

type StaticCalculationParameterForElternteil = {
  persoenlicheDaten: PersoenlicheDaten;
  finanzdaten: FinanzDaten;
};

type GeplanteMonate = Parameters<BerechneElterngeldbezuegeCallback>[1];

if (import.meta.vitest) {
  const { beforeEach, vi, describe, it, expect } = import.meta.vitest;

  describe("errechnete Elterngeldbezüge selector", async () => {
    const { renderHook } = await import("@/test-utils/test-utils");
    const { ErwerbsArt, KassenArt, SteuerKlasse, RentenArt, KinderFreiBetrag } =
      await import("@/elterngeldrechner/model");
    const { KeinElterngeld } = await import("@/monatsplaner");

    vi.mock(import("@/redux/persoenlicheDatenFactory"));
    vi.mock(import("@/redux/finanzDatenFactory"));
    vi.mock(import("@/elterngeldrechner/egr-calculation"));

    beforeEach(() => {
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(ANY_PERSOENLICHE_DATEN);
      vi.mocked(finanzDatenOfUi).mockReturnValue(ANY_FINANZDATEN);
      vi.mocked(calculateElternGeld).mockReturnValue(ANY_CALCULATION_RESULT);
    });

    it("calls the methods to create the static calculation parameter only once initially", () => {
      const { result } = renderHook(() => useBerechneElterngeldbezuege());

      expect(persoenlicheDatenOfUi).toHaveBeenCalled();
      expect(finanzDatenOfUi).toHaveBeenCalled();
      vi.clearAllMocks();

      result.current(ANY_ELTERNTEIL, ANY_MONATE);
      result.current(ANY_ELTERNTEIL, ANY_MONATE);

      expect(persoenlicheDatenOfUi).not.toHaveBeenCalled();
      expect(finanzDatenOfUi).not.toHaveBeenCalled();
    });

    it("uses the initially created static calculation parameters for the calculation calls", () => {
      const persoenlicheDaten = ANY_PERSOENLICHE_DATEN;
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(persoenlicheDaten);

      const finanzDaten = ANY_FINANZDATEN;
      vi.mocked(finanzDatenOfUi).mockReturnValue(finanzDaten);

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {});

      expect(calculateElternGeld).toHaveBeenCalledWith({
        persoenlicheDaten,
        finanzDaten,
        planungsDaten: expect.anything() as PlanungsDaten,
      });
    });

    it("transforms the chosen Variante of the geplante Monate for the calculation", () => {
      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(Variante.Plus),
        2: monat(Variante.Basis),
        4: monat(KeinElterngeld),
        5: monat(Variante.Bonus),
        6: monat(undefined),
      });

      expect(calculateElternGeld).toHaveBeenCalledOnce();
      expect(
        vi.mocked(calculateElternGeld).mock.calls[0]?.[0].planungsDaten.planung,
      ).toStrictEqual([
        ElternGeldArt.ELTERNGELD_PLUS,
        ElternGeldArt.BASIS_ELTERNGELD,
        ElternGeldArt.KEIN_BEZUG,
        ElternGeldArt.KEIN_BEZUG,
        ElternGeldArt.ELTERNGELD_PLUS,
        ElternGeldArt.KEIN_BEZUG,
        ...Array<ElternGeldArt>(26).fill(ElternGeldArt.KEIN_BEZUG),
      ]);
    });

    it("reads the correct values for each Lebensmonat if calculation was successful", () => {
      vi.mocked(calculateElternGeld).mockReturnValue(
        calculationResult([100, 200]),
      );

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      const elterngeldbezuege = result.current(ANY_ELTERNTEIL, {});

      expect(elterngeldbezuege).toStrictEqual({ 1: 100, 2: 200 });
    });

    it("skips Monate without a Variante chosen when transforming the Finanzdaten", () => {
      const observeredErwerbsZeitraumLebensMonatListen =
        spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen();

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(KeinElterngeld, 100),
        2: monat(Variante.Plus, 200),
        5: monat(Variante.Bonus, 500),
        8: monat(undefined, 800),
      });

      expect(observeredErwerbsZeitraumLebensMonatListen).toStrictEqual([
        [
          {
            vonLebensMonat: 2,
            bisLebensMonat: 2,
            bruttoProMonat: new Einkommen(200),
          },
          {
            vonLebensMonat: 5,
            bisLebensMonat: 5,
            bruttoProMonat: new Einkommen(500),
          },
        ],
      ]);
    });

    it("skips Monate without Bruttoeinkommen when transforming Lebensmonate for the Finanzdaten", () => {
      const observeredErwerbsZeitraumLebensMonatListen =
        spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen();

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      result.current(ANY_ELTERNTEIL, {
        1: monat(Variante.Basis, 100),
        2: monat(Variante.Plus, null),
        5: monat(Variante.Basis, 0),
        8: monat(Variante.Bonus, 800),
      });

      expect(observeredErwerbsZeitraumLebensMonatListen).toStrictEqual([
        [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 1,
            bruttoProMonat: new Einkommen(100),
          },
          {
            vonLebensMonat: 8,
            bisLebensMonat: 8,
            bruttoProMonat: new Einkommen(800),
          },
        ],
      ]);
    });

    const ANY_ELTERNTEIL = Elternteil.Eins;
    const ANY_MONATE = {};
    const ANY_PERSOENLICHE_DATEN = {
      anzahlKuenftigerKinder: 1,
      wahrscheinlichesGeburtsDatum: new Date(),
      etVorGeburt: ErwerbsArt.NEIN,
    };

    const ANY_FINANZDATEN = {
      bruttoEinkommen: new Einkommen(0),
      steuerKlasse: SteuerKlasse.SKL1,
      kinderFreiBetrag: KinderFreiBetrag.ZKF0,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    function monat(
      gewaehlteOption?: Auswahloption,
      bruttoeinkommen?: number | null,
    ): Monat {
      return {
        gewaehlteOption,
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }

    /**
     * Spy on the {@link calculateElternGeld} function and capture the
     * erwerbsZeitraumLebensMonatList it was called with.
     *
     * This is a special "implementation" to overcome some limitations. The
     * tested code implicitly uses shared memory objects. Thereby, it is not
     * possible to observe call (parameters) via the {@link MockInstance}. As
     * these data structures can't be properly cloned, only some properties are
     * captured, navigating around this issue.
     *
     * @returns list that continuously captures the observed parameters
     */
    function spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen(): ErwerbsZeitraumLebensMonat[][] {
      const observeredErwerbsZeitraumLebensMonatListen: ErwerbsZeitraumLebensMonat[][] =
        [];

      vi.mocked(calculateElternGeld).mockImplementation((daten) => {
        observeredErwerbsZeitraumLebensMonatListen.push(
          daten.finanzDaten.erwerbsZeitraumLebensMonatList,
        );
        return calculationResult([]);
      });

      return observeredErwerbsZeitraumLebensMonatListen;
    }

    const ANY_CALCULATION_RESULT = {
      elternGeldAusgabe: [],
      ersatzRate: 0,
      geschwisterBonusDeadLine: null,
      nettoNachGeburtDurch: 0,
      geschwisterBonus: 0,
      mehrlingsZulage: 0,
      bruttoBasis: 0,
      nettoBasis: 0,
      elternGeldBasis: 0,
      elternGeldErwBasis: 0,
      bruttoPlus: 0,
      nettoPlus: 0,
      elternGeldEtPlus: 0,
      elternGeldKeineEtPlus: 0,
      hasPartnerBonusError: false,
      etVorGeburt: false,
    };

    function calculationResult(
      elterngeldbezugProMonatsIndex: number[],
    ): ElternGeldPlusErgebnis {
      return {
        ...ANY_CALCULATION_RESULT,
        elternGeldAusgabe: elterngeldbezugProMonatsIndex.map(
          (elterngeldbezug, monthIndex) => ({
            lebensMonat: monthIndex + 1,
            elternGeld: elterngeldbezug,
            mehrlingsZulage: 0,
            geschwisterBonus: 0,
            elterngeldArt: ElternGeldArt.KEIN_BEZUG,
            mutterschaftsLeistungMonat: false,
          }),
        ),
      };
    }
  });
}
