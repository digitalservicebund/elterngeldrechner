import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { Elternteil } from "@/monatsplaner/Elternteil";
import type { InformationenZumMutterschutz } from "@/monatsplaner/InformationenZumMutterschutz";

export function findeInformationenZumMutterschutz(
  events: FormEvent[],
  anzahlKinder: number,
): InformationenZumMutterschutz<Elternteil.Eins> | undefined {
  const elternteil = [...events]
    .reverse()
    .find((event): event is ElternteilEinsAllgemeineAngabenEvent => {
      return isElternteilEinsAllgemeineAngabenEvent(event);
    });

  if (!elternteil?.payload.istImMutterschutz) {
    return undefined;
  }

  return {
    empfaenger: Elternteil.Eins,
    letzterLebensmonatMitSchutz: anzahlKinder > 1 ? 3 : 2,
  };
}

type ElternteilEinsAllgemeineAngabenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilEinsAllgemeineAngaben }
>;

function isElternteilEinsAllgemeineAngabenEvent(
  event: FormEvent,
): event is ElternteilEinsAllgemeineAngabenEvent {
  return event.route === Route.ElternteilEinsAllgemeineAngaben;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeInformationenZumMutterschutz", () => {
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

    it("is undefined when Elternteil 1 is not in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1OhneMutterschutz],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("sets Elternteil.Eins as Empfänger for one Elternteil in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        1,
      );

      expect(result?.empfaenger).toEqual(Elternteil.Eins);
    });

    it("sets letzterLebensmonatMitSchutz to 2 for a single child", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(2);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        2,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });
  });
}
