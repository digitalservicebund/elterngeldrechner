import {
  pushTrackingEvent,
  setTrackingVariable,
  trackAngabeEinesEinkommens,
  trackAnzahlGeplanteMonateMitEinkommen,
  trackAnzahlGeplanterMonateDesPartnersDerMutter,
  trackPartnerschaftlicheVerteilung,
} from "@/application/user-tracking";
import {
  type Ausgangslage,
  type Auswahloption,
  Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonate,
  type Monat,
  type Plan,
  type PlanMitBeliebigenElternteilen,
  Variante,
  isVariante,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

export function trackMetricsForPlanungDrucken(): void {
  pushTrackingEvent("Planung-wurde-gedruckt");
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

export function trackMetricsForDerPlanHatSichGeaendert(
  plan: PlanMitBeliebigenElternteilen,
  istPlanGueltig: boolean,
): void {
  if (istPlanGueltig) {
    trackPartnerschaftlicheVerteilungForPlan(plan);
  }

  evaluateAndTrackMonatMitEinkommenMetrics(plan);
  evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(plan);
}

export function trackMetricsForEineOptionWurdeGewaehlt(): void {
  pushTrackingEvent("Option-wurde-im-Planer-gewaehlt");
}

export function trackMetricsForPlanWurdeZurueckgesetzt(): void {
  pushTrackingEvent("Plan-wurde-zurückgesetzt");
  setTrackingVariable("Identifier-des-ausgewaehlten-Beispiels-im-Planer", null);
}

function evaluateAndTrackMonatMitEinkommenMetrics(
  plan: PlanMitBeliebigenElternteilen,
) {
  const monateMitEinkommen = countMonateMitEinkommen(plan);

  if (monateMitEinkommen > 0) {
    trackAngabeEinesEinkommens();
  }

  trackAnzahlGeplanteMonateMitEinkommen(monateMitEinkommen);
}

function countMonateMitEinkommen(plan: PlanMitBeliebigenElternteilen) {
  const hatMonatEinkommen = (monat: Monat) => {
    return !!(
      monat.bruttoeinkommen &&
      monat.bruttoeinkommen > 0 &&
      monat.gewaehlteOption
    );
  };

  return Object.values(plan.lebensmonate)
    .map((it) => Object.values(it).filter(hatMonatEinkommen).length)
    .reduce((acc, cur) => acc + cur, 0);
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
  const { vi, describe, beforeEach, it, expect } = import.meta.vitest;

  describe("track metrics for planer", () => {
    describe("evaluate and track events regarding months with income", () => {
      it("counts month with income per lebensmonate and elternteil", () => {
        const plan = {
          ausgangslage: {
            anzahlElternteile: 2 as const,
            pseudonymeDerElternteile: {
              [Elternteil.Eins]: "Jane",
              [Elternteil.Zwei]: "Joe",
            },
            geburtsdatumDesKindes: new Date(),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false as const,
                bruttoeinkommen: 2000,
              },
              [Elternteil.Zwei]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false as const,
                bruttoeinkommen: 2000,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false as const,
                bruttoeinkommen: 2000,
              },
              [Elternteil.Zwei]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false as const,
              },
            },
          },
        };

        expect(countMonateMitEinkommen(plan)).toBe(3);
      });
    });

    describe("evaluate and track Anzahl geplanter Monate des Partners der Mutter", async () => {
      const { Variante, KeinElterngeld } = await import("@/monatsplaner");

      beforeEach(async () => {
        vi.spyOn(
          await import("@/application/user-tracking"),
          "trackAnzahlGeplanterMonateDesPartnersDerMutter",
        );
      });

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
