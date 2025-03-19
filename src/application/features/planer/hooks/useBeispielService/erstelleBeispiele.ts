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
  const basis = { [Elternteil.Eins]: MONAT_MIT_BASIS };
  const plus = { [Elternteil.Eins]: MONAT_MIT_PLUS };

  return [
    {
      identifier: crypto.randomUUID(),
      titel: "Ungeteilte Zeit fürs Kind",
      beschreibung:
        "Basiselterngeld um sich ganz auf das Kind zu konzentrieren. Für eine wertvolle Zeit.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 12 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Länger Elterngeld erhalten",
      beschreibung:
        "Nach einem Jahr wieder in den Beruf einsteigen und Kita-Start begleiten.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 10 },
        { lebensmonat: plus, anzahl: 4 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Maximales Elterngeld",
      beschreibung:
        "Mehr finanzielle Sicherheit bei halben Elterngeld. Lohnt sich besonders bei Teilzeit.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 2 },
        { lebensmonat: plus, anzahl: 20 },
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
  const bonus = { [Elternteil.Eins]: MONAT_MIT_BONUS };

  return [
    {
      identifier: crypto.randomUUID(),
      titel: "Ungeteilte Zeit fürs Kind",
      beschreibung:
        "Basiselterngeld um sich ganz auf das Kind zu konzentrieren. Für eine wertvolle Zeit.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: sindPartnermonateVerfuegbar ? 14 : 12 },
        { lebensmonat: bonus, anzahl: 4 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Länger Elterngeld erhalten",
      beschreibung:
        "Nach einem Jahr wieder in den Beruf einsteigen und Kita-Start begleiten.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: sindPartnermonateVerfuegbar ? 12 : 10 },
        { lebensmonat: plus, anzahl: 4 },
        { lebensmonat: bonus, anzahl: 4 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Maximales Elterngeld",
      beschreibung:
        "Mehr finanzielle Sicherheit, während des Wiedereinstieg in den Beruf.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: basis, anzahl: 8 },
        { lebensmonat: plus, anzahl: sindPartnermonateVerfuegbar ? 12 : 8 },
        { lebensmonat: bonus, anzahl: 4 },
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
    MONAT_MIT_PLUS,
    UNGEPLANTER_MONAT,
  );

  const beidePlus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_PLUS,
    MONAT_MIT_PLUS,
  );

  const beideBonus = lebensmonatFuerMutterMitPartnerIn(
    ausgangslage,
    MONAT_MIT_BONUS,
    MONAT_MIT_BONUS,
  );

  return [
    {
      identifier: crypto.randomUUID(),
      titel: "Gleichberechtigte Aufteilung",
      beschreibung:
        "Für Eltern, die sich partnerschaftlich bei der Betreuung und Erziehung abwechseln möchten.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        {
          lebensmonat: nurMutterBasis,
          anzahl: sindPartnermonateVerfuegbar ? 7 : 6,
        },
        {
          lebensmonat: nurPartnerInBasis,
          anzahl: sindPartnermonateVerfuegbar ? 7 : 6,
        },
        { lebensmonat: beideBonus, anzahl: 4 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Maximales Elterngeld",
      beschreibung:
        "Mehr Familienzeit und flexible Arbeitsgestaltung, unabhängig von der finanziellen Situation.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: nurMutterBasis, anzahl: 2 },
        { lebensmonat: nurMutterPlus, anzahl: 5 },
        { lebensmonat: beidePlus, anzahl: 5 },
        {
          lebensmonat: nurPartnerInPlus,
          anzahl: sindPartnermonateVerfuegbar ? 9 : 5,
        },
        { lebensmonat: beideBonus, anzahl: 4 },
      ]),
    },
    {
      identifier: crypto.randomUUID(),
      titel: "Elternzeit mit Unterstützung des Partners",
      beschreibung:
        "Perfekt für Eltern, die den ersten Monat gemeinsam erleben und den Kita-Start begleiten möchten.",
      plan: erstellePlanFuerEinBeispiel(ausgangslage, [
        { lebensmonat: beideBasis, anzahl: 1 },
        {
          lebensmonat: nurMutterBasis,
          anzahl: sindPartnermonateVerfuegbar ? 11 : 9,
        },
        { lebensmonat: nurPartnerInBasis, anzahl: 1 },
        { lebensmonat: beideBonus, anzahl: 4 },
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

const MONAT_MIT_BONUS: Monat = {
  gewaehlteOption: Variante.Bonus,
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
    } = await import("@/monatsplaner");
    const {
      assert,
      property,
      boolean: arbitraryBoolean,
      string: arbitraryString,
      date: arbitraryDate,
      option: arbitraryOption,
      record: arbitraryRecord,
    } = await import("fast-check");

    // TODO: Property test for any Ausgangslage produces correct Plan.
    // TODO: "Property test" for unique identifiers.
    // TODO: Property test that no Titel nor Beschreibung is empty.
    // TODO: Property test that no Plan is empty or just Mutterschutz.
    // TODO: Property test that always three examples are created.

    describe("for single Elternteil", () => {
      it("always creates a correct Plan for each Beispiel", () => {
        assert(
          property(
            arbitraryFlag(),
            arbitraryFlag(),
            arbitraryDate(),
            (
              istAlleinerziehend,
              mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
              geburtsdatumDesKindes,
            ) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 1,
                istAlleinerziehend,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
                geburtsdatumDesKindes,
              };

              const beispiele = erstelleBeispiele(ausgangslage);

              beispiele.forEach((beispiel) => {
                expectPlanToBeCorrect(beispiel.plan);
              });
            },
          ),
        );
      });
    });

    describe("for two Elternteile", () => {
      it("always creates a correct Plan for each Beispiel", () => {
        assert(
          property(
            arbitraryFlag(),
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate(),
            (
              mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
              pseudonymeDerElternteile,
              geburtsdatumDesKindes,
            ) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
                pseudonymeDerElternteile,
                geburtsdatumDesKindes,
              };

              const beispiele = erstelleBeispiele(ausgangslage);

              beispiele.forEach(({ plan }) => {
                expectPlanToBeCorrect(plan);
              });
            },
          ),
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
          property(
            arbitraryFlag(),
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate(),
            (
              mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
              pseudonymeDerElternteile,
              geburtsdatumDesKindes,
            ) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
                pseudonymeDerElternteile,
                geburtsdatumDesKindes,
              };

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
            },
          ),
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

    const TOLERATED_VALIDATION_VIOLATION_MESSAGES = [
      "Bitte beachten Sie: Die Planung ist derzeit noch nicht vollständig. Während Sie den Partnerschaftsbonus bekommen, müssen Sie 24 bis 32 Stunden pro Woche arbeiten. Tragen Sie bitte das voraussichtliche Einkommen für diese Monate ein.",
    ];

    function arbitraryPseudonymeDerElternteile() {
      return arbitraryRecord({
        [Elternteil.Eins]: arbitraryString(),
        [Elternteil.Zwei]: arbitraryString(),
      });
    }

    function arbitraryFlag() {
      return arbitraryOption(arbitraryBoolean(), { nil: undefined });
    }
  });
}
