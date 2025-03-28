import { berechneZeitraumFuerLebensmonat } from "@/lebensmonatrechner";
import {
  type Ausgangslage,
  type ElternteileByAusgangslage,
  type Lebensmonat,
  type Lebensmonatszahl,
  type Monat,
  Variante,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

export function beschreibePlanungImLebensmonat<A extends Ausgangslage>(
  ausgangslage: A,
  lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>,
): string {
  const beschreibungProElternteil = listeElternteileFuerAusgangslageAuf(
    ausgangslage,
  ).map((elternteil) =>
    beschreibeElternteil(ausgangslage, elternteil, lebensmonat[elternteil]),
  );

  return verknuepfteSaetze(...beschreibungProElternteil);
}

export function beschreibeZeitraumDesLebensmonats(
  ausgangslage: Ausgangslage,
  lebensmonatszahl: Lebensmonatszahl,
): string {
  const { from, to } = berechneZeitraumFuerLebensmonat(
    ausgangslage.geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = from.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = to.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `Im Zeitraum vom ${formattedFrom} bis zum ${formattedTo}.`;
}

function beschreibeElternteil<A extends Ausgangslage>(
  ausgangslage: A,
  elternteil: ElternteileByAusgangslage<A>,
  monat: Monat,
): string {
  return verknuepfteSaetze(
    beschreibeOptionsauswahl(ausgangslage, elternteil, monat),
    beschreibeEinkommen(ausgangslage, elternteil, monat),
  );
}

function beschreibeOptionsauswahl<A extends Ausgangslage>(
  ausgangslage: A,
  elternteil: ElternteileByAusgangslage<A>,
  monat: Monat,
): string {
  const istEinElternteil = ausgangslage.anzahlElternteile === 1;
  return setzeSatzAusBausteinenZusammen(
    formuliereAnrede(ausgangslage, elternteil),
    beschreibeMutterschutz(istEinElternteil, monat),
    beschreibeGewaehlteOption(istEinElternteil, monat),
    beschreibeElterngeldbezug(istEinElternteil, monat),
  );
}

function beschreibeEinkommen<A extends Ausgangslage>(
  ausgangslage: A,
  elternteil: ElternteileByAusgangslage<A>,
  monat: Monat,
): string | undefined {
  if (monat.bruttoeinkommen) {
    const istEinElternteil = ausgangslage.anzahlElternteile === 1;

    return setzeSatzAusBausteinenZusammen(
      formuliereAnrede(ausgangslage, elternteil),
      beschreibeBruttoeinkommen(istEinElternteil, monat),
    );
  } else return undefined;
}

function formuliereAnrede<A extends Ausgangslage>(
  ausgangslage: A,
  elternteil: ElternteileByAusgangslage<A>,
): string {
  return ausgangslage.anzahlElternteile === 1
    ? "Sie"
    : ausgangslage.pseudonymeDerElternteile[elternteil];
}

function beschreibeMutterschutz(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  if (monat.imMutterschutz) {
    const verb = istEinElternteil ? "sind" : "ist";
    return `${verb} im Mutterschutz`;
  } else return undefined;
}

function beschreibeGewaehlteOption(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  const { imMutterschutz, gewaehlteOption } = monat;
  const istEineOptionGewaehlt = gewaehlteOption !== undefined;

  if (!imMutterschutz && istEineOptionGewaehlt) {
    const verb = istEinElternteil ? "wählen" : "wählt";
    const istBonus = gewaehlteOption === Variante.Bonus;
    const artikel = istBonus ? "den " : "";
    return `${verb} ${artikel}${gewaehlteOption}`;
  } else if (!imMutterschutz && !istEineOptionGewaehlt) {
    const verb = istEinElternteil ? "haben" : "hat";
    return `${verb} keine Auswahl getroffen`;
  } else return undefined;
}

function beschreibeElterngeldbezug(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  const { elterngeldbezug } = monat;

  if (elterngeldbezug) {
    const verb = istEinElternteil ? "bekommen" : "bekommt";
    return `und ${verb} ${elterngeldbezug} Euro Elterngeld`;
  } else return undefined;
}

function beschreibeBruttoeinkommen(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  const { bruttoeinkommen } = monat;

  if (bruttoeinkommen) {
    const verb = istEinElternteil ? "haben" : "hat";
    return `${verb} ein Bruttoeinkommen von ${bruttoeinkommen} Euro`;
  } else return undefined;
}

function setzeSatzAusBausteinenZusammen(
  ...bausteine: (string | undefined)[]
): string {
  return bausteine
    .filter((baustein) => !!baustein)
    .join(" ")
    .replaceAll(/\s+/g, " ")
    .concat(".");
}

function verknuepfteSaetze(...saetze: (string | undefined)[]): string {
  return saetze.filter((satz) => !!satz).join(" ");
}

if (import.meta.vitest) {
  const { describe, test, expect, it, vi, beforeEach } = import.meta.vitest;

  describe("beschreibe Lebensmonat", async () => {
    const { Elternteil, Variante, KeinElterngeld, MONAT_MIT_MUTTERSCHUTZ } =
      await import("@/monatsplaner");

    describe("beschreibe Planung im Lebensmonat", () => {
      it("combines the Beschreibung for two Elternteile", () => {
        const ausgangslage = {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
        };

        const lebensmonat = {
          [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
          [Elternteil.Zwei]: {
            gewaehlteOption: Variante.Plus,
            elterngeldbezug: 1234,
            bruttoeinkommen: 5678,
            imMutterschutz: false as const,
          },
        };

        const beschreibung = beschreibePlanungImLebensmonat(
          ausgangslage,
          lebensmonat,
        );

        expect(beschreibung).toBe(
          "Jane ist im Mutterschutz. John wählt ElterngeldPlus und bekommt 1234 Euro Elterngeld. John hat ein Bruttoeinkommen von 5678 Euro.",
        );
      });

      it("provides a Beschreibung for a single Elternteil", () => {
        const ausgangslage = {
          anzahlElternteile: 1 as const,
          geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
        };

        const lebensmonat = {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            elterngeldbezug: 1234,
            bruttoeinkommen: 5678,
            imMutterschutz: false as const,
          },
        };

        const beschreibung = beschreibePlanungImLebensmonat(
          ausgangslage,
          lebensmonat,
        );

        expect(beschreibung).toBe(
          "Sie wählen Basiselterngeld und bekommen 1234 Euro Elterngeld. Sie haben ein Bruttoeinkommen von 5678 Euro.",
        );
      });

      describe("beschreibe Elternteil", () => {
        const pseudonym = "Jane";

        test.each([
          {
            istEinElternteil: true,
            monat: MONAT_MIT_MUTTERSCHUTZ,
            beschreibung: "Sie sind im Mutterschutz.",
          },
          {
            istEinElternteil: false,
            monat: MONAT_MIT_MUTTERSCHUTZ,
            beschreibung: "Jane ist im Mutterschutz.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: undefined,
              imMutterschutz: false as const,
            },
            beschreibung: "Sie haben keine Auswahl getroffen.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: undefined,
              imMutterschutz: false as const,
            },
            beschreibung: "Jane hat keine Auswahl getroffen.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: Variante.Basis,
              imMutterschutz: false as const,
            },
            beschreibung: "Sie wählen Basiselterngeld.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: Variante.Basis,
              imMutterschutz: false as const,
            },
            beschreibung: "Jane wählt Basiselterngeld.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: Variante.Bonus,
              elterngeldbezug: 1234,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Sie wählen den Partnerschaftsbonus und bekommen 1234 Euro Elterngeld.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: Variante.Bonus,
              elterngeldbezug: 1234,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Jane wählt den Partnerschaftsbonus und bekommt 1234 Euro Elterngeld.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: KeinElterngeld,
              elterngeldbezug: null,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Sie wählen kein Elterngeld. Sie haben ein Bruttoeinkommen von 5678 Euro.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: KeinElterngeld,
              elterngeldbezug: null,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Jane wählt kein Elterngeld. Jane hat ein Bruttoeinkommen von 5678 Euro.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: Variante.Plus,
              elterngeldbezug: 1234,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Sie wählen ElterngeldPlus und bekommen 1234 Euro Elterngeld. Sie haben ein Bruttoeinkommen von 5678 Euro.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: Variante.Plus,
              elterngeldbezug: 1234,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Jane wählt ElterngeldPlus und bekommt 1234 Euro Elterngeld. Jane hat ein Bruttoeinkommen von 5678 Euro.",
          },
          {
            istEinElternteil: true,
            monat: {
              gewaehlteOption: undefined,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Sie haben keine Auswahl getroffen. Sie haben ein Bruttoeinkommen von 5678 Euro.",
          },
          {
            istEinElternteil: false,
            monat: {
              gewaehlteOption: undefined,
              bruttoeinkommen: 5678,
              imMutterschutz: false as const,
            },
            beschreibung:
              "Jane hat keine Auswahl getroffen. Jane hat ein Bruttoeinkommen von 5678 Euro.",
          },
        ])("$beschreibung", ({ istEinElternteil, monat, beschreibung }) => {
          const ausgangslage = istEinElternteil
            ? {
                anzahlElternteile: 1 as const,
                geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
              }
            : {
                anzahlElternteile: 2 as const,
                pseudonymeDerElternteile: {
                  [Elternteil.Eins]: pseudonym,
                  [Elternteil.Zwei]: "Elternteil 2",
                },
                geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
              };

          expect(
            beschreibeElternteil(ausgangslage, Elternteil.Eins, monat),
          ).toBe(beschreibung);
        });
      });
    });

    describe("beschreibe Zeitraum des Lebensmonats", () => {
      beforeEach(async () => {
        vi.spyOn(
          await import("@/lebensmonatrechner"),
          "berechneZeitraumFuerLebensmonat",
        ).mockReturnValue({
          from: new Date(),
          to: new Date(),
        });
      });

      it("calls the domain function to calculate the Zeitraum", () => {
        const ausgangslage = {
          geburtsdatumDesKindes: new Date(2013, 7, 3),
          anzahlElternteile: 1 as const,
        };

        beschreibeZeitraumDesLebensmonats(ausgangslage, 5);

        expect(berechneZeitraumFuerLebensmonat).toHaveBeenCalledOnce();
        expect(berechneZeitraumFuerLebensmonat).toHaveBeenCalledWith(
          new Date(2013, 7, 3),
          5,
        );
      });

      it("has no year for the start date if equal to the final date's year", () => {
        vi.mocked(berechneZeitraumFuerLebensmonat).mockReturnValue({
          from: new Date(2013, 3, 7),
          to: new Date(2013, 4, 6),
        });

        const beschreibung = beschreibeZeitraumDesLebensmonats(
          ANY_AUSGANGSLAGE,
          1,
        );

        expect(beschreibung).toBe(
          "Im Zeitraum vom 7. April bis zum 6. Mai 2013.",
        );
      });

      it("has a year for start and end date if they are not equal", () => {
        vi.mocked(berechneZeitraumFuerLebensmonat).mockReturnValue({
          from: new Date(2013, 11, 7),
          to: new Date(2014, 0, 6),
        });

        const beschreibung = beschreibeZeitraumDesLebensmonats(
          ANY_AUSGANGSLAGE,
          1,
        );

        expect(beschreibung).toBe(
          "Im Zeitraum vom 7. Dezember 2013 bis zum 6. Januar 2014.",
        );
      });
    });

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
    const ANY_AUSGANGSLAGE = {
      geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      anzahlElternteile: 1 as const,
    };
  });
}
