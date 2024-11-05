import {
  listeMonateAuf,
  Variante,
  type Elternteil,
  type Lebensmonat,
  type Monat,
  type PseudonymeDerElternteile,
} from "@/features/planer/domain";

export function beschreibeLebensmonat<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  pseudonymeDerElternteile: PseudonymeDerElternteile<E>,
): string {
  const istEinElternteil = Object.keys(lebensmonat).length === 1;

  const beschreibungProElternteil = listeMonateAuf(lebensmonat, true).map(
    ([elternteil, monat]) => {
      const pseudonym = pseudonymeDerElternteile[elternteil];
      return beschreibeElternteil(istEinElternteil, pseudonym, monat);
    },
  );

  return verknuepfteSaetze(...beschreibungProElternteil);
}

function beschreibeElternteil(
  istEinElternteil: boolean,
  pseudonym: string,
  monat: Monat,
): string {
  return verknuepfteSaetze(
    beschreibeOptionsauswahl(istEinElternteil, pseudonym, monat),
    beschreibeEinkommen(istEinElternteil, pseudonym, monat),
  );
}

function beschreibeOptionsauswahl(
  istEinElternteil: boolean,
  pseudonym: string,
  monat: Monat,
): string {
  return setzeSatzAusBausteinenZusammen(
    formuliereAnrede(istEinElternteil, pseudonym),
    beschreibeMutterschutz(istEinElternteil, monat),
    beschreibeGewaehlteOption(istEinElternteil, monat),
    beschreibeElterngeldbezug(istEinElternteil, monat),
  );
}

function beschreibeEinkommen(
  istEinElternteil: boolean,
  pseudonym: string,
  monat: Monat,
): string | undefined {
  if (monat.bruttoeinkommen) {
    return setzeSatzAusBausteinenZusammen(
      formuliereAnrede(istEinElternteil, pseudonym),
      beschreibeBruttoeinkommen(istEinElternteil, monat),
    );
  }
}

function formuliereAnrede(
  istEinElternteil: boolean,
  pseudonym: string,
): string {
  return istEinElternteil ? "Sie" : pseudonym;
}

function beschreibeMutterschutz(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  if (monat.imMutterschutz) {
    const verb = istEinElternteil ? "sind" : "ist";
    return `${verb} im Mutterschutz`;
  }
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
  }
}

function beschreibeElterngeldbezug(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  const { elterngeldbezug } = monat;

  if (elterngeldbezug) {
    const verb = istEinElternteil ? "bekommen" : "bekommt";
    return `und ${verb} ${elterngeldbezug} Euro Elterngeld`;
  }
}

function beschreibeBruttoeinkommen(
  istEinElternteil: boolean,
  monat: Monat,
): string | undefined {
  const { bruttoeinkommen } = monat;

  if (bruttoeinkommen) {
    const verb = istEinElternteil ? "haben" : "hat";
    return `${verb} ein Bruttoeinkommen von ${bruttoeinkommen} Euro`;
  }
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
  const { describe, test, expect } = import.meta.vitest;

  describe("beschreibe Lebensmonat", async () => {
    const { Elternteil, Variante, KeinElterngeld, MONAT_MIT_MUTTERSCHUTZ } =
      await import("@/features/planer/domain");

    it("combines the Beschreibung for two Elternteile", () => {
      const lebensmonat = {
        [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
        [Elternteil.Zwei]: {
          gewaehlteOption: Variante.Plus,
          elterngeldbezug: 1234,
          bruttoeinkommen: 5678,
          imMutterschutz: false as const,
        },
      };
      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      const beschreibung = beschreibeLebensmonat(
        lebensmonat,
        pseudonymeDerElternteile,
      );

      expect(beschreibung).toBe(
        "Jane ist im Mutterschutz. John wählt ElterngeldPlus und bekommt 1234 Euro Elterngeld. John hat ein Bruttoeinkommen von 5678 Euro.",
      );
    });

    it("provides a Beschreibung for a single Elternteil", () => {
      const lebensmonat = {
        [Elternteil.Eins]: {
          gewaehlteOption: Variante.Basis,
          elterngeldbezug: 1234,
          bruttoeinkommen: 5678,
          imMutterschutz: false as const,
        },
      };

      const pseudonymeDerElternteile = {
        [Elternteil.Eins]: "Jane",
      };

      const beschreibung = beschreibeLebensmonat(
        lebensmonat,
        pseudonymeDerElternteile,
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
        expect(beschreibeElternteil(istEinElternteil, pseudonym, monat)).toBe(
          beschreibung,
        );
      });
    });
  });
}
