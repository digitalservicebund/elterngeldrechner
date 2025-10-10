import {
  pushTrackingEvent,
  setTrackingVariable,
  trackPartnerschaftlicheVerteilung,
} from "@/application/user-tracking";
import {
  type Ausgangslage,
  type Auswahloption,
  Elternteil,
  type ElternteileByAusgangslage,
  type Monat,
  type Plan,
  type PlanMitBeliebigenElternteilen,
  Variante,
  isVariante,
  listeElternteileFuerAusgangslageAuf,
  listeLebensmonateAuf,
  listeMonateAuf,
} from "@/monatsplaner";

export function trackMetricsForAngabeEinesEinkommens(): void {
  pushTrackingEvent("einkommen-im-monat-angegeben", { unique: true });
}

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

  trackGeplanteMonate(plan);
  trackGeplanteMonateMitEinkommen(plan);
  trackGeplanteMonateDesPartnersDerMutter(plan);
}

export function trackMetricsForEineOptionWurdeGewaehlt(): void {
  pushTrackingEvent("Option-wurde-im-Planer-gewaehlt");
}

export function trackMetricsForPlanWurdeZurueckgesetzt(): void {
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

function trackGeplanteMonate(plan: PlanMitBeliebigenElternteilen) {
  const filterOptions = {
    monatPredicate: istGeplanterMonat,
  };

  const geplanteMonate = zaehleMonate(plan, filterOptions);

  setTrackingVariable("geplante-monate", geplanteMonate);
}

function trackGeplanteMonateMitEinkommen(plan: PlanMitBeliebigenElternteilen) {
  const filterOptions = {
    monatPredicate: istMonatMitEinkommen,
  };

  const monateMitEinkommen = zaehleMonate(plan, filterOptions);

  if (monateMitEinkommen > 0) {
    pushTrackingEvent("einkommen-im-monat-angegeben", { unique: true });
  }

  setTrackingVariable("geplante-monate-mit-einkommen", monateMitEinkommen);
}

/**
 * The Partner:in of the Mutter is the Elternteil without Mutterschaftsleistung.
 * That means this only applies if there are more than one Elternteil and if any
 * of them receives Mutterschaftsleistungen.Geplante Monate are only those where
 * the Partner:in receives Elterngeld.
 */
function trackGeplanteMonateDesPartnersDerMutter<A extends Ausgangslage>(
  plan: Plan<A>,
): void {
  const partnerDerMutter = bestimmePartnerDerMutter(plan.ausgangslage);

  if (partnerDerMutter !== null) {
    const filterOptions = {
      monatPredicate: istGeplanterMonat,
      elternteilPredicate: partnerDerMutter,
    };

    const anzahlGeplanterMonate = zaehleMonate(plan, filterOptions);

    const trackingKey = "geplante-monate-des-partners-der-mutter";

    setTrackingVariable(trackingKey, anzahlGeplanterMonate);
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

function istGeplanterMonat(monat: Monat) {
  return isVariante(monat.gewaehlteOption);
}

function istMonatMitEinkommen(monat: Monat) {
  return !!(
    monat.bruttoeinkommen &&
    monat.bruttoeinkommen > 0 &&
    monat.gewaehlteOption
  );
}

type ZaehleMonatFilter = Partial<{
  monatPredicate: (monat: Monat) => boolean;
  elternteilPredicate: Elternteil;
}>;

function zaehleMonate<A extends Ausgangslage>(
  plan: Plan<A>,
  filterOptions: ZaehleMonatFilter,
) {
  const alleMonate = listeLebensmonateAuf(plan.lebensmonate).flatMap(
    ([_, lebensmonat]) => listeMonateAuf(lebensmonat),
  );

  const gefilterteMonate = alleMonate
    .filter(([elternteil, _]) => {
      return filterOptions.elternteilPredicate
        ? filterOptions.elternteilPredicate === elternteil
        : true;
    })
    .filter(([_, monat]) => {
      return filterOptions.monatPredicate
        ? filterOptions.monatPredicate(monat)
        : true;
    });

  return gefilterteMonate.length;
}

if (import.meta.vitest) {
  const { vi, describe, it, expect } = import.meta.vitest;

  describe("track metrics for planer", () => {
    describe("evaluate and track geplante monate mit einkommen", async () => {
      const trackingModule = await import("@/application/user-tracking");

      it("counts month with income per lebensmonate and elternteil", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

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

        trackGeplanteMonateMitEinkommen(plan);

        expect(trackingFunction).toHaveBeenCalledWith(expect.anything(), 3);
      });
    });

    describe("evaluate and track geplante monate", async () => {
      const { Variante, KeinElterngeld } = await import("@/monatsplaner");
      const trackingModule = await import("@/application/user-tracking");

      it("counts month per lebensmonate and elternteil including kein elterngeld", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

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
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false as const,
              },
              [Elternteil.Zwei]: {
                gewaehlteOption: KeinElterngeld,
                imMutterschutz: false as const,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false as const,
              },
              [Elternteil.Zwei]: {
                gewaehlteOption: undefined,
                imMutterschutz: false as const,
              },
            },
          },
        };

        trackGeplanteMonate(plan);

        expect(trackingFunction).toHaveBeenCalledWith(expect.anything(), 2);
      });
    });

    describe("evaluate and track geplante monate des partners der mutter", async () => {
      const { Variante, KeinElterngeld } = await import("@/monatsplaner");
      const trackingModule = await import("@/application/user-tracking");

      it("tracks nothing if given a Plan with single Elternteil, even it has Mutterschutz", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

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

        trackGeplanteMonateDesPartnersDerMutter(plan);

        expect(trackingFunction).not.toHaveBeenCalled();
      });

      it("tracks nothing if there are two Elternteile but none has Mutterschutz", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

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

        trackGeplanteMonateDesPartnersDerMutter(plan);

        expect(trackingFunction).not.toHaveBeenCalled();
      });

      it("tracks number of Monate with a Varinate of the Elternteil that does not have Mutterschutz", () => {
        const trackingFunction = vi.spyOn(
          trackingModule,
          "setTrackingVariable",
        );

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

        trackGeplanteMonateDesPartnersDerMutter(plan);

        expect(trackingFunction).toHaveBeenCalledOnce();
        expect(trackingFunction).toHaveBeenCalledWith(expect.anything(), 2);
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
