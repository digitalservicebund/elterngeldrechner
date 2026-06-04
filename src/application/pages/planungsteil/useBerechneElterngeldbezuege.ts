import { useCallback, useRef } from "react";
import { erstelleFinanzdatenAllerElternteile } from "@/application/features/abfrageteil-next/domain/erstelleFinanzdaten";
import { erstellePersoenlicheDatenAllerElternteile } from "@/application/features/abfrageteil-next/domain/erstellePersoenlicheDaten";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { FormEvent } from "@/application/features/abfrageteil-next/routing";
import {
  Einkommen,
  ElternGeldArt,
  type ElternGeldDaten,
  type ElternGeldPlusErgebnis,
  type ErwerbsZeitraumLebensMonat,
  type FinanzDaten,
  Geburtstag,
  MutterschaftsLeistung,
  type PersoenlicheDaten,
  type PlanungsDaten,
  Steuerklasse,
  calculateElternGeld,
} from "@/elterngeldrechner";
import { ErwerbsArt, KassenArt, RentenArt } from "@/elterngeldrechner/model";
import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  Lebensmonatszahlen,
  type Monat,
  Variante,
  isVariante,
} from "@/monatsplaner";
import {
  BerechneElterngeldbezuegeCallback,
  Elterngeldbezuege,
} from "@/monatsplaner/Elterngeldbezug";

export function useBerechneElterngeldbezuege() {
  const eventContext = useEventContext();

  const parameter = useRef(
    createStaticCalculationParameter(eventContext.filtereValideEventHistorie()),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    berechneElterngeldbezuege.bind(null, parameter.current),
    [],
  );
}

function berechneElterngeldbezuege(
  staticParameter: StaticCalculationParameter,
  elternteil: Elternteil,
  monate: GeplanteMonate,
): Elterngeldbezuege {
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

  const kinderfreibetrag = berechneKinderfreibetrag(
    persoenlicheDaten?.geschwister?.length ?? 0,
    finanzdaten.steuerklasse,
  );

  return {
    persoenlicheDaten,
    planungsDaten: planungsdaten,
    finanzDaten: { ...finanzdaten, kinderFreiBetrag: kinderfreibetrag },
  };
}

// TODO: Move back to finanzdaten in abfrageteil-next
function berechneKinderfreibetrag(
  anzahlGeschwister: number,
  steuerklasse: Steuerklasse,
) {
  switch (steuerklasse) {
    case Steuerklasse.I:
    case Steuerklasse.II:
    case Steuerklasse.IV:
    case Steuerklasse.IVMitFaktor:
      return anzahlGeschwister * 0.5;
    case Steuerklasse.III:
      return anzahlGeschwister;
    case Steuerklasse.V:
    case Steuerklasse.VI:
      return 0;
  }
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
): Elterngeldbezuege {
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

function createStaticCalculationParameter(
  events: FormEvent[],
): StaticCalculationParameter {
  const finanzdaten = erstelleFinanzdatenAllerElternteile(events);
  const persoenlicheDaten = erstellePersoenlicheDatenAllerElternteile(events);

  const sindBeideElternteile =
    finanzdaten.anzahlElternteile === 2 &&
    persoenlicheDaten.anzahlElternteile === 2;

  if (sindBeideElternteile) {
    return {
      [Elternteil.Eins]: {
        persoenlicheDaten: persoenlicheDaten[Elternteil.Eins],
        finanzdaten: finanzdaten[Elternteil.Eins],
      },
      [Elternteil.Zwei]: {
        persoenlicheDaten: persoenlicheDaten[Elternteil.Zwei],
        finanzdaten: finanzdaten[Elternteil.Zwei],
      },
    };
  }

  return {
    [Elternteil.Eins]: {
      persoenlicheDaten: persoenlicheDaten[Elternteil.Eins],
      finanzdaten: finanzdaten[Elternteil.Eins],
    },
    [Elternteil.Zwei]: erstelleDefaultElternteilZweiParameter(
      persoenlicheDaten[Elternteil.Eins],
    ),
  };
}

function erstelleDefaultElternteilZweiParameter(
  persoenlicheDatenDefault: PersoenlicheDaten,
): StaticCalculationParameterForElternteil {
  return {
    persoenlicheDaten: {
      ...persoenlicheDatenDefault,
      etVorGeburt: ErwerbsArt.NEIN,
    },
    finanzdaten: {
      bruttoEinkommen: new Einkommen(0),
      steuerklasse: Steuerklasse.I,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    },
  };
}

type StaticCalculationParameter = Record<
  Elternteil,
  StaticCalculationParameterForElternteil
>;

type StaticCalculationParameterForElternteil = {
  persoenlicheDaten: PersoenlicheDaten;
  finanzdaten: Omit<FinanzDaten, "kinderFreiBetrag">;
};

type GeplanteMonate = Parameters<BerechneElterngeldbezuegeCallback>[1];

if (import.meta.vitest) {
  const { beforeEach, vi, describe, it, expect } = import.meta.vitest;

  describe("errechnete Elterngeldbezüge selector", async () => {
    const { renderHook } = await import("@testing-library/react");
    const { KeinElterngeld } = await import("@/monatsplaner");

    beforeEach(async () => {
      vi.spyOn(
        await import("@/application/features/abfrageteil-next/events/EventContext"),
        "useEventContext",
      ).mockReturnValue({
        findeVorherigenPfad: () => "/",
        filtereValideEventHistorie: () => [],
        findeAlleGueltigenEvents: () => [],
        findeLetztesEvent: () => undefined,
        findeLetztesGueltigesEvent: () => undefined,
        dispatch: () => {},
      });

      vi.spyOn(
        await import("@/application/features/abfrageteil-next/domain/erstellePersoenlicheDaten"),
        "erstellePersoenlicheDatenAllerElternteile",
      ).mockReturnValue({
        anzahlElternteile: 1,
        [Elternteil.Eins]: ANY_PERSOENLICHE_DATEN,
      });

      vi.spyOn(
        await import("@/application/features/abfrageteil-next/domain/erstelleFinanzdaten"),
        "erstelleFinanzdatenAllerElternteile",
      ).mockReturnValue({
        anzahlElternteile: 1,
        [Elternteil.Eins]: ANY_FINANZDATEN,
      });

      vi.spyOn(
        await import("@/elterngeldrechner"),
        "calculateElternGeld",
      ).mockReturnValue(ANY_CALCULATION_RESULT);
    });

    it("calls the methods to create the static calculation parameter only once initially", () => {
      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      expect(erstellePersoenlicheDatenAllerElternteile).toHaveBeenCalled();
      expect(erstelleFinanzdatenAllerElternteile).toHaveBeenCalled();

      vi.clearAllMocks();

      berechneElterngeldbezuege(ANY_ELTERNTEIL, ANY_MONATE);

      berechneElterngeldbezuege(ANY_ELTERNTEIL, ANY_MONATE);

      expect(erstellePersoenlicheDatenAllerElternteile).not.toHaveBeenCalled();
      expect(erstelleFinanzdatenAllerElternteile).not.toHaveBeenCalled();
    });

    it("uses the initially created static calculation parameters for the calculation calls", () => {
      const persoenlicheDaten = ANY_PERSOENLICHE_DATEN;
      vi.mocked(erstellePersoenlicheDatenAllerElternteile).mockReturnValue({
        anzahlElternteile: 1,
        [Elternteil.Eins]: persoenlicheDaten,
      });

      const finanzDaten = ANY_FINANZDATEN;
      vi.mocked(erstelleFinanzdatenAllerElternteile).mockReturnValue({
        anzahlElternteile: 1,
        [Elternteil.Eins]: finanzDaten,
      });

      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      berechneElterngeldbezuege(ANY_ELTERNTEIL, {});

      expect(calculateElternGeld).toHaveBeenCalledWith({
        persoenlicheDaten,
        finanzDaten,
        planungsDaten: expect.anything() as PlanungsDaten,
      });
    });

    it("transforms the chosen Variante of the geplante Monate for the calculation", () => {
      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      berechneElterngeldbezuege(ANY_ELTERNTEIL, {
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

      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      const elterngeldbezuege = berechneElterngeldbezuege(ANY_ELTERNTEIL, {});

      expect(elterngeldbezuege).toStrictEqual({ 1: 100, 2: 200 });
    });

    it("skips Monate without a Variante chosen when transforming the Finanzdaten", () => {
      const observeredErwerbsZeitraumLebensMonatListen =
        spyOnCalculationAndObserveErwerbsZeitraumLebensMonatListen();

      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      berechneElterngeldbezuege(ANY_ELTERNTEIL, {
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

      const hook = renderHook(() => useBerechneElterngeldbezuege());

      const berechneElterngeldbezuege = hook.result.current;

      berechneElterngeldbezuege(ANY_ELTERNTEIL, {
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

  describe("buildParameterForCalculation", () => {
    let mockStaticParameter: StaticCalculationParameterForElternteil;

    beforeEach(() => {
      mockStaticParameter = {
        persoenlicheDaten: {
          ...ANY_PERSOENLICHE_DATEN,
          geschwister: [{ geburtstag: ANY_GEBURTSTAG }],
        },
        finanzdaten: ANY_FINANZDATEN,
      };
    });

    it("berechnet den Kinderfreibetrag korrekt auf 0.5, wenn ein Geschwisterkind vorhanden ist und Steuerklasse I gewählt", () => {
      const result = buildParameterForCalculation(
        mockStaticParameter,
        ANY_MONATE,
      );

      expect(result.finanzDaten.kinderFreiBetrag).toBe(0.5);
    });

    it("berechnet den Kinderfreibetrag korrekt auf 1, wenn ein Geschwisterkind vorhanden ist und Steuerklasse III gewählt", () => {
      const specificMockStaticParameter = {
        ...mockStaticParameter,
        finanzdaten: {
          ...ANY_FINANZDATEN,
          steuerklasse: Steuerklasse.III,
        },
      };
      const result = buildParameterForCalculation(
        specificMockStaticParameter,
        ANY_MONATE,
      );

      expect(result.finanzDaten.kinderFreiBetrag).toBe(1);
    });

    it("berechnet den Kinderfreibetrag korrekt auf 0, wenn ein Geschwisterkind vorhanden ist und Steuerklasse V gewählt", () => {
      const specificMockStaticParameter = {
        ...mockStaticParameter,
        finanzdaten: {
          ...ANY_FINANZDATEN,
          steuerklasse: Steuerklasse.V,
        },
      };
      const result = buildParameterForCalculation(
        specificMockStaticParameter,
        ANY_MONATE,
      );

      expect(result.finanzDaten.kinderFreiBetrag).toBe(0);
    });
  });

  const ANY_MONATE = {};
  const ANY_PERSOENLICHE_DATEN = {
    anzahlKuenftigerKinder: 1,
    geburtstagDesKindes: new Geburtstag(Date.now()),
    etVorGeburt: ErwerbsArt.NEIN,
  };
  const ANY_GEBURTSTAG = new Geburtstag(Date.now());
  const ANY_FINANZDATEN = {
    bruttoEinkommen: new Einkommen(0),
    steuerklasse: Steuerklasse.I,
    kinderFreiBetrag: 0,
    kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1.0,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}
