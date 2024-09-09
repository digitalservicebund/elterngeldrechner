import { setTrackingVariable } from "./data-layer";
import { trackPartnerschaftlicheVerteilung } from "./partnerschaftlichkeit";
import {
  Elternteil,
  KeinElterngeld,
  Top,
  Variante,
  type Auswahloption,
  type Lebensmonat,
} from "@/features/planer/domain";

vi.mock("./data-layer.ts");

describe("partnerschaftlichkeit", () => {
  it("sets the tracking variable 'partnerschaftlicheverteilung'", () => {
    trackPartnerschaftlicheVerteilung(ANY_PLAN_WITH_TWO_ELTERNTEILE);

    expect(setTrackingVariable).toHaveBeenCalledTimes(1);
    expect(setTrackingVariable).toHaveBeenLastCalledWith(
      "partnerschaftlicheverteilung",
      expect.anything(),
    );
  });

  it("should not track anything if there is only one Elternteil", () => {
    trackPartnerschaftlicheVerteilung(ANY_PLAN_WITH_ONE_ELTERNTEIL);

    expect(setTrackingVariable).not.toHaveBeenCalled();
  });

  it.each<{
    lebensmonate: Lebensmonat<Elternteil>[];
    expectedQuotient: number;
  }>([
    {
      lebensmonate: [],
      expectedQuotient: 0,
    },
    {
      lebensmonate: [lebensmonat(KeinElterngeld, Variante.Basis)],
      expectedQuotient: 0,
    },
    {
      lebensmonate: [
        lebensmonat(Variante.Plus, KeinElterngeld),
        lebensmonat(Variante.Plus, undefined),
      ],
      expectedQuotient: 0,
    },
    {
      lebensmonate: [lebensmonat(Variante.Basis, Variante.Basis)],
      expectedQuotient: 1,
    },
    {
      lebensmonate: [lebensmonat(Variante.Plus, Variante.Plus)],
      expectedQuotient: 1,
    },
    {
      lebensmonate: [lebensmonat(Variante.Basis, Variante.Plus)],
      expectedQuotient: 0.5,
    },
    {
      lebensmonate: [lebensmonat(Variante.Plus, Variante.Basis)],
      expectedQuotient: 0.5,
    },
    {
      lebensmonate: [
        lebensmonat(Variante.Basis, Variante.Plus),
        lebensmonat(KeinElterngeld, Variante.Plus),
      ],
      expectedQuotient: 1,
    },
    {
      lebensmonate: [
        lebensmonat(Variante.Basis, Variante.Plus),
        lebensmonat(Variante.Plus, Variante.Plus),
        lebensmonat(Variante.Plus, Variante.Plus),
      ],
      expectedQuotient: 0.75,
    },
    {
      lebensmonate: [
        lebensmonat(Variante.Basis, KeinElterngeld),
        lebensmonat(Variante.Bonus, Variante.Bonus),
        lebensmonat(Variante.Bonus, Variante.Bonus),
        lebensmonat(Variante.Bonus, Variante.Bonus),
      ],
      expectedQuotient: 0.6,
    },
    {
      lebensmonate: Array(12).fill(lebensmonat(Variante.Basis, KeinElterngeld)),
      expectedQuotient: 0,
    },
    {
      lebensmonate: [
        ...Array(12).fill(lebensmonat(Variante.Basis, KeinElterngeld)),
        lebensmonat(KeinElterngeld, Variante.Basis),
        lebensmonat(KeinElterngeld, Variante.Basis),
      ],
      expectedQuotient: 2 / 12,
    },
  ])(
    "should calculate the correct quotient (%#)",
    ({ lebensmonate, expectedQuotient }) => {
      const plan = {
        ...ANY_PLAN_WITH_TWO_ELTERNTEILE,
        lebensmonate: lebensmonate.reduce(
          (lebensmonate, lebensmonat, index) => ({
            ...lebensmonate,
            [index]: lebensmonat,
          }),
          {},
        ),
      };

      trackPartnerschaftlicheVerteilung(plan);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        expectedQuotient,
      );
    },
  );
});

function lebensmonat(
  gewaehlteOptionElternteilEins?: Auswahloption,
  gewaehlteOptionElternteilZwei?: Auswahloption,
): Lebensmonat<Elternteil> {
  return {
    [Elternteil.Eins]: {
      gewaehlteOption: gewaehlteOptionElternteilEins,
      imMutterschutz: false as const,
    },
    [Elternteil.Zwei]: {
      gewaehlteOption: gewaehlteOptionElternteilZwei,
      imMutterschutz: false as const,
    },
  };
}

const ANY_PLAN_WITH_ONE_ELTERNTEIL = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
    geburtsdatumDesKindes: new Date(),
  },
  errechneteElterngeldbezuege: {} as any,
  lebensmonate: {},
  gueltigerPlan: Top,
};

const ANY_PLAN_WITH_TWO_ELTERNTEILE = {
  ausgangslage: {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    },
    geburtsdatumDesKindes: new Date(),
  },
  errechneteElterngeldbezuege: {} as any,
  lebensmonate: {},
  gueltigerPlan: Top,
};
