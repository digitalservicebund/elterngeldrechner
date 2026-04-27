import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import { Elternteil } from "@/monatsplaner/Elternteil";
import type { InformationenZumMutterschutz } from "@/monatsplaner/InformationenZumMutterschutz";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeAusklammerungen } from "./findeAusklammerungen";
import { findeLetztesGueltigesEvent } from "../events/projections";

export function findeInformationenZumMutterschutz(
  events: FormEvent[],
  anzahlKinder: number,
): InformationenZumMutterschutz<Elternteil.Eins | Elternteil.Zwei> | undefined {
  const geburtsdatum = findeGeburtsdatum(events);

  const mutterschutzElternteil1 = findeAusklammerungen(events, 0, true).find(
    (ausklammerung) => ausklammerung.grund === "mutterschutz",
  );

  if (mutterschutzElternteil1) {
    const { months: mutterschutzMonateNachGeburt } = geburtsdatum.until(
      mutterschutzElternteil1.bis,
      {
        smallestUnit: "months",
        roundingMode: "ceil",
      },
    );
    const letzterLebensmonatMitSchutz = (
      anzahlKinder > 1 ? 3 : mutterschutzMonateNachGeburt
    ) as Lebensmonatszahl;
    return { empfaenger: Elternteil.Eins, letzterLebensmonatMitSchutz };
  }

  const elternteil1 = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilEinsAllgemeineAngaben,
  );

  if (elternteil1?.istAlleinerziehend) return undefined;

  const mutterschutzElternteil2 = findeAusklammerungen(events, 1, true).find(
    (ausklammerung) => ausklammerung.grund === "mutterschutz",
  );

  if (mutterschutzElternteil2) {
    const { months: mutterschutzMonateNachGeburt } = geburtsdatum.until(
      mutterschutzElternteil2.bis,
      {
        smallestUnit: "months",
        roundingMode: "ceil",
      },
    );
    const letzterLebensmonatMitSchutz = (
      anzahlKinder > 1 ? 3 : mutterschutzMonateNachGeburt
    ) as Lebensmonatszahl;
    return { empfaenger: Elternteil.Zwei, letzterLebensmonatMitSchutz };
  }

  return undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeInformationenZumMutterschutz", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    const geborenesKind: FormEvent = {
      route: Route.GeborenesKindAngaben,
      payload: {
        geburtsdatum: Temporal.PlainDate.from("2026-03-03"),
        errechneterEntbindungstermin: Temporal.PlainDate.from("2026-03-03"),
        anzahl: 1,
      },
    };

    const fruehGeborenesKind: FormEvent = {
      route: Route.GeborenesKindAngaben,
      payload: {
        geburtsdatum: Temporal.PlainDate.from("2026-02-01"),
        errechneterEntbindungstermin: Temporal.PlainDate.from("2026-03-03"),
        anzahl: 1,
      },
    };

    const elternteil1OhneMutterschutz: FormEvent = {
      route: Route.ElternteilEinsAllgemeineAngaben,
      payload: {
        name: "Hanna",
        istAlleinerziehend: false,
        istImMutterschutz: false,
      },
    };

    const elternteil1MitMutterschutz: FormEvent = {
      route: Route.ElternteilEinsAllgemeineAngaben,
      payload: {
        name: "Hanna",
        istAlleinerziehend: false,
        istImMutterschutz: true,
      },
    };

    const elternteil2OhneMutterschutz: FormEvent = {
      route: Route.ElternteilZweiAllgemeineAngaben,
      payload: {
        name: "Max",
        istImMutterschutz: false,
      },
      dependentValues: {
        istSchwangerschaftsbedingteErkrankungMoeglich: false,
        nächsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
      },
    };

    const elternteil2MitMutterschutz: FormEvent = {
      route: Route.ElternteilZweiAllgemeineAngaben,
      payload: {
        name: "Max",
        istImMutterschutz: true,
      },
      dependentValues: {
        istSchwangerschaftsbedingteErkrankungMoeglich: false,
        nächsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
      },
    };

    it("is undefined when Elternteil 1 is alleinerziehend and not in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Hanna",
              istAlleinerziehend: true,
              istImMutterschutz: false,
            },
          },
          geborenesKind,
        ],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("is undefined when neither Elternteil is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          elternteil2OhneMutterschutz,
          geborenesKind,
        ],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("sets Elternteil.Eins as Empfänger when Elternteil 1 is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz, geborenesKind],
        1,
      );

      expect(result?.empfaenger).toEqual(Elternteil.Eins);
    });

    it("sets letzterLebensmonatMitSchutz to 2 for a single child", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz, geborenesKind],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(2);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz, geborenesKind],
        2,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for a single child with early birth", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz, fruehGeborenesKind],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });

    it("sets Elternteil.Zwei as Empfänger when Elternteil 2 is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          elternteil2MitMutterschutz,
          geborenesKind,
        ],
        1,
      );

      expect(result?.empfaenger).toEqual(Elternteil.Zwei);
    });

    it("sets letzterLebensmonatMitSchutz to 2 for a single child (Elternteil 2)", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          elternteil2MitMutterschutz,
          geborenesKind,
        ],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(2);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge (Elternteil 2)", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          elternteil2MitMutterschutz,
          geborenesKind,
        ],
        2,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for a single child with early birth (Elternteil 2)", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          elternteil2MitMutterschutz,
          fruehGeborenesKind,
        ],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });
  });
}
