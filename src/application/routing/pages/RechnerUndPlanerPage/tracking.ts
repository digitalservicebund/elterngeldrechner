import {
  pushTrackingEvent,
  resetTrackingPlanung,
  setTrackingVariable,
  trackAnzahlGeplanterMonateDesPartnersDerMutter,
  trackPartnerschaftlicheVerteilung,
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
} from "@/application/user-tracking";
import {
  type Ausgangslage,
  type Auswahloption,
  Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonate,
  type Plan,
  type PlanMitBeliebigenElternteilen,
  Variante,
  isVariante,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

export function trackMetricsForPlanerWurdeGeoeffnet(): void {
  resetTrackingPlanung();
}

export function trackMetricsForErklaerungenWurdenGeoeffnet(): void {
  pushTrackingEvent("Erklärungen-im-Planer-wurden-geöffnet");
}

export function trackMetricsForErklaerungenWurdenGeschlossen(): void {
  pushTrackingEvent("Erklärungen-im-Planer-wurden-geschlossen");
}

export function trackMetricsForLebensmonatWurdeGeoeffnet(): void {
  pushTrackingEvent("Lebensmonat-wurde-im-Planer-geöffnet");
}

export function trackMetricsForEinBeispielWurdeAusgewaehlt(beispiel: {
  identifier: string;
}): void {
  setTrackingVariable(
    "Identifier-des-ausgewaehlten-Beispiels-im-Planer",
    beispiel.identifier,
  );

  pushTrackingEvent("Beispiel-wurde-im-Planer-ausgewählt");
}

export function trackMetricsForDerPlanHatSichGeaendert(
  plan: PlanMitBeliebigenElternteilen,
  istPlanGueltig: boolean,
): void {
  if (istPlanGueltig) {
    trackPartnerschaftlicheVerteilungForPlan(plan);
  }

  trackPlannedMonths(plan);
  trackPlannedMonthsWithIncome(plan);
  evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(plan);
  pushTrackingEvent("Plan-wurde-geändert");
}

export function trackMetricsForEineOptionWurdeGewaehlt(): void {
  pushTrackingEvent("Option-wurde-im-Planer-gewaehlt");
}

export function trackMetricsForPlanWurdeZurueckgesetzt(): void {
  resetTrackingPlanung();
  pushTrackingEvent("Plan-wurde-zurückgesetzt");
  setTrackingVariable("Identifier-des-ausgewaehlten-Beispiels-im-Planer", null);
}

function trackPartnerschaftlicheVerteilungForPlan(
  plan: PlanMitBeliebigenElternteilen,
): void {
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  const auswahlProMonatProElternteil = elternteile.map((elternteil) =>
    Object.values(plan.lebensmonate)
      .map((lebensmonat) => lebensmonat[elternteil])
      .map((monat) => monat.gewaehlteOption)
      .map((option) => {
        switch (option) {
          case Variante.Basis:
            return "Basis";
          case Variante.Plus:
            return "Plus";
          case Variante.Bonus:
            return "Bonus";
          default:
            return null;
        }
      }),
  );

  trackPartnerschaftlicheVerteilung(auswahlProMonatProElternteil);
}

function evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter<
  A extends Ausgangslage,
>(plan: Plan<A>): void {
  const partnerDerMutter = bestimmePartnerDerMutter(plan.ausgangslage);
  const isTrackingApplicable = partnerDerMutter !== null;

  if (isTrackingApplicable) {
    const anzahlGeplanterMonate = countGeplanteMonate(
      plan.lebensmonate,
      partnerDerMutter,
    );
    trackAnzahlGeplanterMonateDesPartnersDerMutter(anzahlGeplanterMonate);
  }
}

function bestimmePartnerDerMutter<A extends Ausgangslage>(
  ausgangslage: A,
): ElternteileByAusgangslage<A> | null {
  if (ausgangslage.anzahlElternteile === 1) {
    return null;
  } else {
    switch (ausgangslage.informationenZumMutterschutz?.empfaenger) {
      case Elternteil.Eins:
        return Elternteil.Zwei as ElternteileByAusgangslage<A>;

      case Elternteil.Zwei:
        return Elternteil.Eins as ElternteileByAusgangslage<A>;

      case undefined:
        return null;
    }
  }
}

function countGeplanteMonate<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  partner: E,
): number {
  return Object.values(lebensmonate)
    .map((lebensmonat) => lebensmonat[partner])
    .map((monat) => monat.gewaehlteOption)
    .filter(isVariante).length;
}

if (import.meta.vitest) {
  const { vi, describe, it, expect } = import.meta.vitest;

  describe("track metrics for planer", () => {
    describe("evaluate and track Anzahl geplanter Monate des Partners der Mutter", async () => {
      const { Variante, KeinElterngeld } = await import("@/monatsplaner");

      vi.mock(import("@/application/user-tracking/metrics/planung"));

      it("tracks nothing if given a Plan with single Elternteil, even it has Mutterschutz", () => {
        const plan = {
          ausgangslage: {
            anzahlElternteile: 1 as const,
            informationenZumMutterschutz: {
              empfaenger: Elternteil.Eins as const,
              letzterLebensmonatMitSchutz: 2 as const,
            },
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: ANY_MONAT_MIT_ELTERNGELDBEZUG,
            },
          },
        };

        evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(plan);

        expect(
          trackAnzahlGeplanterMonateDesPartnersDerMutter,
        ).not.toHaveBeenCalled();
      });

      it("tracks nothing if there are two Elternteile but none has Mutterschutz", () => {
        const plan = {
          ausgangslage: {
            anzahlElternteile: 2 as const,
            informationenZumMutterschutz: undefined,
            pseudonymeDerElternteile: ANY_PSEUDONYME_DER_ELTERNTEILE,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: ANY_MONAT_MIT_ELTERNGELDBEZUG,
              [Elternteil.Zwei]: ANY_MONAT_MIT_ELTERNGELDBEZUG,
            },
          },
        };

        evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(plan);

        expect(
          trackAnzahlGeplanterMonateDesPartnersDerMutter,
        ).not.toHaveBeenCalled();
      });

      it("tracks number of Monate with a Varinate of the Elternteil that does not have Mutterschutz", () => {
        const plan = {
          ausgangslage: {
            anzahlElternteile: 2 as const,
            informationenZumMutterschutz: {
              empfaenger: Elternteil.Zwei,
              letzterLebensmonatMitSchutz: 2 as const,
            },
            pseudonymeDerElternteile: ANY_PSEUDONYME_DER_ELTERNTEILE,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(Variante.Basis),
            },
            3: {
              [Elternteil.Eins]: monat(undefined),
              [Elternteil.Zwei]: monat(Variante.Basis),
            },
            4: {
              [Elternteil.Eins]: monat(KeinElterngeld),
              [Elternteil.Zwei]: monat(Variante.Plus),
            },
            8: {
              [Elternteil.Eins]: monat(Variante.Bonus),
              [Elternteil.Zwei]: monat(Variante.Bonus),
            },
          },
        };

        evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(plan);

        expect(
          trackAnzahlGeplanterMonateDesPartnersDerMutter,
        ).toHaveBeenCalledOnce();
        expect(
          trackAnzahlGeplanterMonateDesPartnersDerMutter,
        ).toHaveBeenCalledWith(2);
      });

      function monat(gewaehlteOption: Auswahloption | undefined) {
        return { gewaehlteOption, imMutterschutz: false as const };
      }

      const ANY_GEBURTSDATUM_DES_KINDES = new Date();
      const ANY_PSEUDONYME_DER_ELTERNTEILE = {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      };

      const ANY_MONAT_MIT_ELTERNGELDBEZUG = monat(Variante.Basis);
    });
  });
}
