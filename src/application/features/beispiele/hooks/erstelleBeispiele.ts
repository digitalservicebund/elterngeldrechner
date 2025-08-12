import type { Arbitrary } from "fast-check";
import { erstellePlanFuerEinBeispiel } from "./erstellePlanFuerEinBeispiel";
import {
  type Ausgangslage,
  type AusgangslageFuerEinElternteil,
  type AusgangslageFuerZweiElternteile,
  Elternteil,
  type Lebensmonat,
  type Monat,
  PartnermonateSindVerfuegbar,
  type Plan,
  Variante,
} from "@/monatsplaner";

export function erstelleBeispiele<A extends Ausgangslage>(
  ausgangslage: A,
): Beispiel<A>[] {
  switch (ausgangslage.anzahlElternteile) {
    case 1:
      return (
        ausgangslage.istAlleinerziehend
          ? erstelleBeispieleFuerAlleinerziehende(ausgangslage)
          : erstelleBeispieleFuerAlleinPlanende(ausgangslage)
      ) as Beispiel<A>[]; // Limitation of TypeScript to match inferred type correctly.

    case 2:
      return erstelleBeispieleFuerDieGemeinsamePlanung(
        ausgangslage,
      ) as Beispiel<A>[]; // Limitation of TypeScript to match inferred type correctly.
  }
}

function erstelleBeispieleFuerAlleinPlanende(
  ausgangslage: AusgangslageFuerEinElternteil,
): Beispiel<AusgangslageFuerEinElternteil>[] {
  const anzahlMonateMitMutterschutz =
    ausgangslage.informationenZumMutterschutz?.letzterLebensmonatMitSchutz ?? 0;

  const basis = { [Elternteil.Eins]: MONAT_MIT_BASIS };
  const plus = { [Elternteil.Eins]: MONAT_MIT_PLUS };

  return [
    {
      identifier: "Allein planend - Ungeteilte Zeit fürs Kind",
      titel: "Ungeteilte Zeit fürs Kind",
      beschreibung:
        "Nutzen Sie Basiselterngeld, um sich ganz auf das Kind zu konzentrieren.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 12 },
      ]),
    },
    {
      identifier: "Allein planend - Beruf und Familie vereinen",
      titel: "Beruf und Familie vereinen",
      beschreibung:
        "Für einen leichteren Übergang während des Wiedereinstiegs in den Beruf.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 10 },
        { lebensmonat: plus, anzahl: 4 },
      ]),
    },
    {
      identifier: "Allein planend - Länger Elterngeld erhalten",
      titel: "Länger Elterngeld erhalten",
      beschreibung:
        "Finanzielle Sicherheit bei halbem Elterngeld. Lohnt sich besonders bei Teilzeit.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 2 },
        {
          lebensmonat: plus,
          anzahl: 20 - Math.max(anzahlMonateMitMutterschutz - 2, 0) * 2,
        },
      ]),
    },
  ];
}

function erstelleBeispieleFuerAlleinerziehende(
  ausgangslage: AusgangslageFuerEinElternteil,
): Beispiel<AusgangslageFuerEinElternteil>[] {
  const sindPartnermonateVerfuegbar =
    PartnermonateSindVerfuegbar.asPredicate(ausgangslage);

  const basis = { [Elternteil.Eins]: MONAT_MIT_BASIS };
  const plus = { [Elternteil.Eins]: MONAT_MIT_PLUS };

  return [
    {
      identifier: "Alleinerziehend - Ungeteilte Zeit fürs Kind",
      titel: "Ungeteilte Zeit fürs Kind",
      beschreibung:
        "Nutzen Sie Basiselterngeld, um sich ganz auf das Kind zu konzentrieren.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: sindPartnermonateVerfuegbar ? 14 : 12 },
      ]),
    },
    {
      identifier: "Alleinerziehend - Beruf und Familie vereinen",
      titel: "Beruf und Familie vereinen",
      beschreibung:
        "Für einen leichteren Übergang während des Wiedereinstiegs in den Beruf.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: sindPartnermonateVerfuegbar ? 12 : 10 },
        { lebensmonat: plus, anzahl: 4 },
      ]),
    },
    {
      identifier: "Alleinerziehend - Länger Elterngeld erhalten",
      titel: "Länger Elterngeld erhalten",
      beschreibung:
        "Finanzielle Sicherheit bei halbem Elterngeld. Lohnt sich besonders bei Teilzeit.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 8 },
        { lebensmonat: plus, anzahl: sindPartnermonateVerfuegbar ? 12 : 8 },
      ]),
    },
  ];
}

function erstelleBeispieleFuerDieGemeinsamePlanung(
  ausgangslage: AusgangslageFuerZweiElternteile,
): Beispiel<AusgangslageFuerZweiElternteile>[] {
  const sindPartnermonateVerfuegbar =
    PartnermonateSindVerfuegbar.asPredicate(ausgangslage);

  const nurMutterBasis = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_BASIS,
    UNGEPLANTER_MONAT,
  );

  const nurPartnerInBasis = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    UNGEPLANTER_MONAT,
    MONAT_MIT_BASIS,
  );

  const beideBasis = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_BASIS,
    MONAT_MIT_BASIS,
  );

  const nurMutterPlus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_PLUS,
    UNGEPLANTER_MONAT,
  );

  const nurPartnerInPlus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    UNGEPLANTER_MONAT,
    MONAT_MIT_PLUS,
  );

  const mutterPlusPartnerInBasis = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_PLUS,
    MONAT_MIT_BASIS,
  );

  const mutterBasisPartnerInPlus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_BASIS,
    MONAT_MIT_PLUS,
  );

  const beidePlus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_PLUS,
    MONAT_MIT_PLUS,
  );

  return [
    {
      identifier: "Gemeinsame Planung - Partnerschaftliche Aufteilung",
      titel: "Partnerschaftliche Aufteilung",
      beschreibung:
        "Für Eltern, die sich die Betreuung ihres Kindes teilen möchten.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        {
          lebensmonat: nurMutterBasis,
          anzahl: sindPartnermonateVerfuegbar ? 7 : 6,
        },
        {
          lebensmonat: nurPartnerInBasis,
          anzahl: sindPartnermonateVerfuegbar ? 7 : 6,
        },
      ]),
    },
    {
      identifier: "Gemeinsame Planung - Länger Elterngeld erhalten",
      titel: "Länger Elterngeld bekommen",
      beschreibung:
        "Lohnt sich, wenn Sie in Teilzeit arbeiten möchten. Für mehr Zeit mit der Familie ",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: nurMutterBasis, anzahl: 2 },
        { lebensmonat: nurMutterPlus, anzahl: 5 },
        { lebensmonat: beidePlus, anzahl: 5 },
        {
          lebensmonat: nurPartnerInPlus,
          anzahl: sindPartnermonateVerfuegbar ? 9 : 5,
        },
      ]),
    },
    {
      identifier: "Gemeinsame Planung - Ein Jahr mit Begleitung",
      titel: "Ein Jahr mit Begleitung",
      beschreibung:
        "Gemeinsam starten. Nach dem ersten Lebensjahr übernimmt der andere Elternteil für einen Monat.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: beideBasis, anzahl: 1 },
        {
          lebensmonat: nurMutterBasis,
          anzahl: sindPartnermonateVerfuegbar ? 11 : 9,
        },
        { lebensmonat: nurPartnerInBasis, anzahl: 1 },
      ]),
    },
    {
      identifier: "Gemeinsame Planung - Start zu zweit - flexibel zurück",
      titel: "Start zu zweit - flexibel zurück",
      beschreibung: "Gemeinsam in die Elternzeit starten und abschließen.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: beideBasis, anzahl: 1 },
        {
          lebensmonat: nurMutterBasis,
          anzahl: sindPartnermonateVerfuegbar ? 8 : 6,
        },
        { lebensmonat: nurMutterPlus, anzahl: 3 },
        { lebensmonat: mutterPlusPartnerInBasis, anzahl: 1 },
        { lebensmonat: nurPartnerInBasis, anzahl: 1 },
      ]),
    },
    {
      identifier: "Gemeinsame Planung - Elternzeit ausschöpfen",
      titel: "Elternzeit ausschöpfen",
      beschreibung:
        "Sechs Monate zusammen Elterngeld nehmen. Dann länger Elternzeit mit halbem Elterngeld.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: mutterBasisPartnerInPlus, anzahl: 2 },
        {
          lebensmonat: beidePlus,
          anzahl: sindPartnermonateVerfuegbar ? 3 : 1,
        },
        { lebensmonat: nurMutterPlus, anzahl: 16 },
      ]),
    },
    {
      identifier: "Gemeinsame Planung - Geteilte Elternzeit",
      titel: "Geteilte Elternzeit",
      beschreibung:
        "Volles und halbes Elterngeld kombiniert: 8 Monate mehr Zeit zusammen verbringen.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: mutterBasisPartnerInPlus, anzahl: 6 },
        {
          lebensmonat: beidePlus,
          anzahl: sindPartnermonateVerfuegbar ? 2 : 0,
        },
        { lebensmonat: nurMutterPlus, anzahl: 6 },
      ]),
    },
  ];
}

/**
 * Twist the given two Monate based on who is the Mutter (based on Mutterschutz)
 * and the Partner:in. If no Mutter can be identified, it defaults to the first
 * Elternteil.
 *
 * The `PartnerIn` spelling is the (potentially confusing) camel case version for
 * the gendered "Partner:in". Unfortunately the domain currently has no gender
 * neutral naming for the `Mutter` in this context.
 */
function lebensmonatFuerMutterMitPartnerIn(
  ausgangslage: AusgangslageFuerZweiElternteile,
  mutter: Monat,
  partnerIn: Monat,
): Lebensmonat<Elternteil> {
  switch (ausgangslage.informationenZumMutterschutz?.empfaenger) {
    case undefined:
    case Elternteil.Eins:
      return { [Elternteil.Eins]: mutter, [Elternteil.Zwei]: partnerIn };

    case Elternteil.Zwei:
      return { [Elternteil.Eins]: partnerIn, [Elternteil.Zwei]: mutter };
  }
}

const MONAT_MIT_BASIS: Monat = {
  gewaehlteOption: Variante.Basis,
  imMutterschutz: false,
};

const MONAT_MIT_PLUS: Monat = {
  gewaehlteOption: Variante.Plus,
  imMutterschutz: false,
};

const UNGEPLANTER_MONAT: Monat = {
  imMutterschutz: false,
};

export type Beispiel<A extends Ausgangslage> = BeschreibungFuerEinBeispiel &
  Readonly<{
    plan: Plan<A>;
  }>;

export type BeschreibungFuerEinBeispiel = Readonly<{
  identifier: BeispielIdentifier;
  titel: string;
  beschreibung: string;
}>;

export type BeispielIdentifier = string; // Just for communication purposes yet.

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Beispiele", async () => {
    const {
      validierePlanFuerFinaleAbgabe,
      teileLebensmonateBeiElternteileAuf,
      zaehleVerplantesKontingent,
      bestimmeVerfuegbaresKontingent,
    } = await import("@/monatsplaner");

    const {
      assert,
      property,
      record,
      constant,
      tuple,
      oneof,
      boolean: arbitraryBoolean,
      string: arbitraryString,
      date: arbitraryDate,
      option: arbitraryOption,
      record: arbitraryRecord,
    } = await import("fast-check");

    describe("erstelleBeispiele", () => {
      it("always creates a correct Plan for each Beispiel", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              beispiele.forEach(({ plan }) => expectPlanToBeCorrect(plan));
            });
          }),
        );
      });

      // We intentionally do not add Bonus in the Beispiele in
      // order to generate Plans which are valid right away without
      // adding an Einkommen.
      it("always creates a Plan without Partnerschaftsbonus", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              beispiele.forEach(({ plan }) =>
                expactPlanWithoutPartnerschaftsbonus(plan),
              );
            });
          }),
        );
      });

      it("always creates a Plan that exhausts the full Kontingent for each Beispiel", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              beispiele.forEach(({ plan }) => {
                expectPlanExhaustsKontingent(plan);
              });
            });
          }),
        );
      });

      it("generates unique identifiers", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              const identifiers = beispiele.map((it) => it.identifier);

              const uniqueIdentifiers = identifiers.filter((item, index) => {
                return identifiers.indexOf(item) === index;
              });

              expect(identifiers.length).toEqual(uniqueIdentifiers.length);
            });
          }),
        );
      });

      it("generated no empty descriptions", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              expect(beispiele.map((it) => it.beschreibung)).not.toContain("");
            });
          }),
        );
      });

      it("generates no empty titles", () => {
        assert(
          property(arbritraryAusgangslagen, (ausgangslagen) => {
            ausgangslagen.forEach((ausgangslage) => {
              const beispiele = erstelleBeispiele(ausgangslage);

              expect(beispiele.map((it) => it.titel)).not.toContain("");
            });
          }),
        );
      });

      /**
       * To produce a somehow readable test case without plenty of utility
       * function for clean code, this test make heavily use (and overloads it)
       * of the terms "left" and "right". Left stands for everything related to
       * the mother being the first Elternteil (commonly displayed left). Right
       * means the "mirrored" version where the mother is the second Elternteil.
       * Type (inlay) hints should do the rest to help follow the test case.
       */
      it("mirrors the Plan based on who is is in Mutterschutz", () => {
        assert(
          property(arbitraryAusgangslageZweiElternteile, (ausgangslage) => {
            const left = erstelleBeispiele({
              ...ausgangslage,
              informationenZumMutterschutz: {
                empfaenger: Elternteil.Eins,
                letzterLebensmonatMitSchutz: 2,
              },
            });

            const right = erstelleBeispiele({
              ...ausgangslage,
              informationenZumMutterschutz: {
                empfaenger: Elternteil.Zwei,
                letzterLebensmonatMitSchutz: 2,
              },
            });

            left
              .map<
                [
                  Beispiel<AusgangslageFuerZweiElternteile>,
                  Beispiel<AusgangslageFuerZweiElternteile>,
                ]
              >((beispiel, index) => [beispiel, right[index]!]) // zip pairs of left and right examples
              .map(([left, right]) => [
                teileLebensmonateBeiElternteileAuf(left.plan),
                teileLebensmonateBeiElternteileAuf(right.plan),
              ])
              .every(([left, right]) => {
                expect(left?.[Elternteil.Eins]).toStrictEqual(
                  right?.[Elternteil.Zwei],
                );

                expect(left?.[Elternteil.Zwei]).toStrictEqual(
                  right?.[Elternteil.Eins],
                );
              });
          }),
        );
      });
    });

    function expectPlanToBeCorrect(plan: Plan<Ausgangslage>): void {
      const violations = validierePlanFuerFinaleAbgabe(plan).mapOrElse<
        Array<{ message: string }>
      >(
        () => [],
        (violations) => violations,
      );

      const criticalViolations = violations.filter(
        (violation) =>
          !TOLERATED_VALIDATION_VIOLATION_MESSAGES.includes(violation.message),
      );

      expect(criticalViolations).toHaveLength(0);
    }

    function expactPlanWithoutPartnerschaftsbonus(
      plan: Plan<Ausgangslage>,
    ): void {
      const verplantesKontingent = zaehleVerplantesKontingent(
        plan.lebensmonate,
      );

      expect(verplantesKontingent.Partnerschaftsbonus).toEqual(0);
    }

    function expectPlanExhaustsKontingent(plan: Plan<Ausgangslage>): void {
      const verfuegbaresKontingent = bestimmeVerfuegbaresKontingent(
        plan.ausgangslage,
      );

      const verplantesKontingent = zaehleVerplantesKontingent(
        plan.lebensmonate,
      );

      const rest = sum(verfuegbaresKontingent) - sum(verplantesKontingent);

      expect(rest).toEqual(0);
    }

    function sum(record: Readonly<Record<Variante, number>>) {
      return record.Basiselterngeld + record.ElterngeldPlus;
    }

    function arbitraryPseudonymeDerElternteile() {
      return arbitraryRecord({
        [Elternteil.Eins]: arbitraryString(),
        [Elternteil.Zwei]: arbitraryString(),
      });
    }

    function arbitraryFlag() {
      return arbitraryOption(arbitraryBoolean(), { nil: undefined });
    }

    const arbitraryAusgangslageEinElternteil: Arbitrary<AusgangslageFuerEinElternteil> =
      record({
        anzahlElternteile: constant(1),
        mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
          arbitraryFlag(),
        istAlleinerziehend: arbitraryFlag(),
        geburtsdatumDesKindes: arbitraryDate(),
      });

    const arbitraryAusgangslageEinElternteilMitMutterschutz: Arbitrary<AusgangslageFuerEinElternteil> =
      record({
        anzahlElternteile: constant(1),
        mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
          arbitraryFlag(),
        istAlleinerziehend: arbitraryFlag(),
        geburtsdatumDesKindes: arbitraryDate(),
        informationenZumMutterschutz: constant({
          empfaenger: Elternteil.Eins,
          letzterLebensmonatMitSchutz: 2,
        }),
      });

    const arbitraryAusgangslageZweiElternteile: Arbitrary<AusgangslageFuerZweiElternteile> =
      record({
        anzahlElternteile: constant(2),
        mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
          arbitraryFlag(),
        pseudonymeDerElternteile: arbitraryPseudonymeDerElternteile(),
        geburtsdatumDesKindes: arbitraryDate(),
      });

    const arbitraryAusgangslageZweiElternteileMitMutterschutz: Arbitrary<AusgangslageFuerZweiElternteile> =
      record({
        anzahlElternteile: constant(2),
        mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
          arbitraryFlag(),
        pseudonymeDerElternteile: arbitraryPseudonymeDerElternteile(),
        geburtsdatumDesKindes: arbitraryDate(),
        informationenZumMutterschutz: record({
          empfaenger: oneof(
            constant(Elternteil.Eins),
            constant(Elternteil.Zwei),
          ),
          letzterLebensmonatMitSchutz: constant(2),
        }),
      });

    // The Ausgangslagen are combined as tuple because it is hard to
    // model dependencies like anzahlElternteile to used properties and
    // also to make sure that each run gets exactly one Ausgangslage with
    // Mutterschutz and one Ausgangslage without Mutterschutz.

    const arbritraryAusgangslagen = tuple(
      arbitraryAusgangslageEinElternteil,
      arbitraryAusgangslageZweiElternteile,
      arbitraryAusgangslageEinElternteilMitMutterschutz,
      arbitraryAusgangslageZweiElternteileMitMutterschutz,
    );

    const TOLERATED_VALIDATION_VIOLATION_MESSAGES = [
      "Beim Partnerschaftsbonus ist Arbeiten in Teilzeit Pflicht. Bitte geben Sie ein Einkommen ein.",
    ];
  });
}
