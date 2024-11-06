import { usePlanerService, type InitialInformation } from "./usePlanerService";
import type {
  BerechneElterngeldbezuegeCallback,
  GebeEinkommenAn,
  PlanChangedCallback,
  WaehleOption,
} from "./callbackTypes";
import {
  aktualisiereErrechneteElterngelbezuege,
  berechneGesamtsumme,
  bestimmeVerfuegbaresKontingent,
  Elternteil,
  erstelleInitialeLebensmonate,
  gebeEinkommenAn,
  KeinElterngeld,
  Lebensmonatszahlen,
  Result,
  setzePlanZurueck,
  Variante,
  waehleOption,
  zaehleVerplantesKontingent,
  type Elterngeldbezuege,
} from ".";
import { erstelleVorschlaegeFuerAngabeDesEinkommens } from "@/features/planer/domain";
import { validierePlanFuerFinaleAbgabe } from "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe";
import { act, INITIAL_STATE, renderHook } from "@/test-utils/test-utils";

vi.mock(import("@/features/planer/domain/plan/operation/waehleOption"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/aktualisiereElterngeldbezuege"
  ),
);
vi.mock(import("@/features/planer/domain/plan/operation/setzePlanZurueck"));
vi.mock(import("@/features/planer/domain/plan/operation/berechneGesamtsumme"));
vi.mock(
  import(
    "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe"
  ),
);
vi.mock(import("@/features/planer/domain/plan/operation/gebeEinkommenAn"));
vi.mock(
  import(
    "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/erstelleInitialeLebensmonate"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/erstelleVorschlaegeFuerAngabeDesEinkommens"
  ),
);
vi.mock(
  import(
    "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent"
  ),
);

describe("use Planer service", () => {
  beforeEach(() => {
    vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});
    vi.mocked(aktualisiereErrechneteElterngelbezuege).mockImplementation(
      (plan) => plan,
    );
    vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
      Result.ok(undefined),
    );
    vi.mocked(waehleOption).mockImplementation((plan) => Result.ok(plan));
    vi.mocked(gebeEinkommenAn).mockImplementation((plan) => plan);
    vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
  });

  describe("initialization", () => {
    it("creates a new plan with given Ausgangslage if no old plan is given", () => {
      vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
        geburtsdatumDesKindes: new Date(),
      };

      const { result } = renderPlanerServiceHook({
        initialInformation: { ausgangslage, plan: undefined },
      });

      expect(erstelleInitialeLebensmonate).toHaveBeenCalledOnce();
      expect(erstelleInitialeLebensmonate).toHaveBeenLastCalledWith(
        ausgangslage,
      );
      expect(result.current.pseudonymeDerElternteile).toStrictEqual(
        ausgangslage.pseudonymeDerElternteile,
      );
      expect(result.current.geburtsdatumDesKindes).toEqual(
        ausgangslage.geburtsdatumDesKindes,
      );
      expect(result.current.lebensmonate).toStrictEqual({});
    });

    it("trigger the calculation of the Elterngeldbezuege when a new Plan is created", () => {
      // Rely on Object.is when using expect statements.
      vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});
      const berrechneElterngeldbezuege = vi.fn(() => ANY_ELTERNGELDBEZUEGE);

      renderPlanerServiceHook({
        initialInformation: { ausgangslage: ANY_AUSGANGSLAGE },
        berrechneElterngeldbezuege,
      });

      expect(berrechneElterngeldbezuege).toHaveBeenCalledOnce();
      expect(berrechneElterngeldbezuege).toHaveBeenCalledWith({});
    });

    it("uses the given old Plan instead to create a new one", () => {
      const plan = ANY_PLAN;

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan, ausgangslage: undefined },
      });

      expect(erstelleInitialeLebensmonate).not.toHaveBeenCalled();
      expect(erstelleInitialeLebensmonate).not.toHaveBeenCalled();
      expect(result.current.pseudonymeDerElternteile).toStrictEqual(
        plan.ausgangslage.pseudonymeDerElternteile,
      );
      expect(result.current.geburtsdatumDesKindes).toStrictEqual(
        plan.ausgangslage.geburtsdatumDesKindes,
      );
      expect(result.current.lebensmonate).toStrictEqual(plan.lebensmonate);
    });
  });

  describe("verfügbares Kontingent", () => {
    it("initially determines the verfügbares Kontingent", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        ANY_VERFUEGBARES_KONTINGENT,
      );

      const { result } = renderPlanerServiceHook();

      expect(bestimmeVerfuegbaresKontingent).toHaveBeenCalledOnce();
      expect(result.current.verfuegbaresKontingent).toStrictEqual(
        ANY_VERFUEGBARES_KONTINGENT,
      );
    });
  });

  describe("verplantes Kontingent", () => {
    it("initially determines the verplantes Kontingent", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        ANY_VERPLANTES_KONTINGENT,
      );

      const { result } = renderPlanerServiceHook();

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent).toStrictEqual(
        ANY_VERPLANTES_KONTINGENT,
      );
    });

    it("updates the verplantes Kontingent when chosing an Option", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 2,
      });
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 1,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(2);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(1);
    });

    it("does not update the verplantes Kontingent when specifying some Bruttoeinkommen", () => {
      const { result } = renderPlanerServiceHook();
      vi.clearAllMocks();

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(zaehleVerplantesKontingent).not.toHaveBeenCalledOnce();
    });

    it("updates the verplantes Kontingent when resetting the Plan", () => {
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 1,
      });
      vi.mocked(zaehleVerplantesKontingent).mockReturnValueOnce({
        ...ANY_VERPLANTES_KONTINGENT,
        [Variante.Basis]: 0,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(1);
      vi.clearAllMocks();

      act(() => result.current.setzePlanZurueck());

      expect(zaehleVerplantesKontingent).toHaveBeenCalledOnce();
      expect(result.current.verplantesKontingent[Variante.Basis]).toBe(0);
    });
  });

  describe("Gesamtsumme", () => {
    it("initially determines the Gesamtsumme", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValue(ANY_GESAMTSUMME);

      const { result } = renderPlanerServiceHook();

      expect(berechneGesamtsumme).toHaveBeenCalledOnce();
      expect(result.current.gesamtsumme).toStrictEqual(ANY_GESAMTSUMME);
    });

    it("updates the Gesamtsumme when chosing an Option", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        elterngeldbezug: 1,
      });
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        elterngeldbezug: 2,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.gesamtsumme.elterngeldbezug).toBe(1);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(berechneGesamtsumme).toHaveBeenCalledOnce();
      expect(result.current.gesamtsumme.elterngeldbezug).toBe(2);
    });

    it("updates the Gesamtsumme when resetting the Plan", () => {
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        elterngeldbezug: 1,
      });
      vi.mocked(berechneGesamtsumme).mockReturnValueOnce({
        ...ANY_GESAMTSUMME,
        elterngeldbezug: 0,
      });

      const { result } = renderPlanerServiceHook();
      expect(result.current.gesamtsumme.elterngeldbezug).toBe(1);

      act(() => result.current.setzePlanZurueck());

      expect(result.current.gesamtsumme.elterngeldbezug).toBe(0);
    });
  });

  describe("Validierungsfehler", () => {
    it("initially has no Fehler when validation for a gültigen Plan is satisifed", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.ok(undefined),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler.length).toBe(0);
    });

    it("initially has Fehler when validation for a gültigen Plan is unsatisfied", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "falsch" }, { message: "ungültig" }]),
      );
      const { result } = renderPlanerServiceHook();

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual([
        "falsch",
        "ungültig",
      ]);
    });

    it("updates the Fehler when choosing an Option and the resulting Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler).toStrictEqual([]);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual(["falsch"]);
    });

    it("clears the Fehler when choosing an Option and the resulting Plan valid again", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler).toStrictEqual(["falsch"]);
      vi.clearAllMocks();

      waehleAnyOption(result.current.waehleOption);

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler).toStrictEqual([]);
    });

    // TODO: Do we need to validate on Einkommen?

    it("updates the Fehler when resetting the Plan and the empty Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.ok(undefined),
      );
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValueOnce(
        Result.error([{ message: "falsch" }]),
      );

      const { result } = renderPlanerServiceHook();
      expect(result.current.validierungsfehler.length).toBe(0);
      vi.clearAllMocks();

      act(() => result.current.setzePlanZurueck());

      expect(validierePlanFuerFinaleAbgabe).toHaveBeenCalledOnce();
      expect(result.current.validierungsfehler.length).toBe(1);
    });
  });

  describe("wähle Option", () => {
    it("updates the Lebensmonate when chosing an Option", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {}, changes: 0 };

      const updatedPlan = {
        ...ANY_PLAN,
        lebensmonate: { 1: ANY_LEBENSMONAT },
        changes: 1,
      };

      vi.mocked(waehleOption).mockReturnValue(Result.ok(updatedPlan));

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => {
        result.current.waehleOption(1, Elternteil.Eins, Variante.Basis);
      });

      expect(waehleOption).toHaveBeenCalledOnce();
      expect(waehleOption).toHaveBeenCalledWith(
        initialPlan,
        1,
        Elternteil.Eins,
        Variante.Basis,
      );
      expect(result.current.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
      );
    });

    it("keeps the last Lebensmonate and logs the error if choosing an Option fails", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };
      vi.mocked(waehleOption).mockReturnValue(
        Result.error([{ message: "invalid plan" }]),
      );
      vi.spyOn(global.console, "error").mockImplementation(() => {});

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      waehleAnyOption(result.current.waehleOption);

      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledOnce();
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith([{ message: "invalid plan" }]);
    });
  });

  describe("erstelle Vorschläge für Angabe des Einkommens", () => {
    it("uses the current Lebensmonate to determine the Vorschläge", async () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
      vi.mocked(erstelleVorschlaegeFuerAngabeDesEinkommens).mockReturnValue([
        100,
      ]);
      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });

      const vorschlaege = await act(() =>
        result.current.erstelleVorschlaegeFuerAngabeDesEinkommens(
          7,
          Elternteil.Zwei,
        ),
      );

      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledOnce();
      expect(erstelleVorschlaegeFuerAngabeDesEinkommens).toHaveBeenCalledWith(
        { 1: ANY_LEBENSMONAT },
        7,
        Elternteil.Zwei,
      );
      expect(vorschlaege).toStrictEqual([100]);
    });
  });

  describe("gebe Einkommen an", () => {
    it("updates the Lebensmonate when specifying an Einkommen", () => {
      const initialPlan = { ...ANY_PLAN, lebensmonate: {} };
      const updatedPlan = { ...ANY_PLAN, lebensmonate: { 1: ANY_LEBENSMONAT } };
      vi.mocked(gebeEinkommenAn).mockReturnValue(updatedPlan);

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
      });
      expect(result.current.lebensmonate).toStrictEqual(
        initialPlan.lebensmonate,
      );

      act(() => result.current.gebeEinkommenAn(1, Elternteil.Eins, 300));

      expect(gebeEinkommenAn).toHaveBeenCalledOnce();
      expect(gebeEinkommenAn).toHaveBeenCalledWith(
        initialPlan,
        1,
        Elternteil.Eins,
        300,
      );
      expect(result.current.lebensmonate).toStrictEqual(
        updatedPlan.lebensmonate,
      );
    });

    it("triggers the callback to calculate Elterngeldbezüge and updates them in the Plan", () => {
      // Rely on Object.is when using expect statements.
      const initialPlan = { ...ANY_PLAN };
      const planWithEinkommen = { ...ANY_PLAN };
      vi.mocked(gebeEinkommenAn).mockReturnValue(planWithEinkommen);
      const elterngeldbezuege = { ...ANY_ELTERNGELDBEZUEGE };
      const berrechneElterngeldbezuege = vi.fn(() => elterngeldbezuege);
      const planWithElterngeldbezuege = { ...ANY_PLAN };
      vi.mocked(aktualisiereErrechneteElterngelbezuege).mockReturnValue(
        planWithElterngeldbezuege,
      );

      const { result } = renderPlanerServiceHook({
        initialInformation: { plan: initialPlan },
        berrechneElterngeldbezuege,
      });
      vi.clearAllMocks();

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(berrechneElterngeldbezuege).toHaveBeenCalledOnce();
      expect(berrechneElterngeldbezuege).toHaveBeenCalledWith(
        planWithEinkommen.lebensmonate,
      );
      expect(aktualisiereErrechneteElterngelbezuege).toHaveBeenCalledOnce();
      expect(aktualisiereErrechneteElterngelbezuege).toHaveBeenCalledWith(
        planWithEinkommen,
        elterngeldbezuege,
      );
      expect(result.current.lebensmonate).toStrictEqual(
        planWithElterngeldbezuege.lebensmonate,
      );
    });
  });

  describe("on Plan changed", () => {
    it("triggers the given callback when chosing an Option", () => {
      vi.mocked(waehleOption).mockReturnValue(Result.ok(ANY_PLAN));
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });

    it("triggers the callback with an undefined Plan when the chosen Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      waehleAnyOption(result.current.waehleOption);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(undefined);
    });

    it("does not trigger callback if the initial Plan is invalid", () => {
      vi.mocked(validierePlanFuerFinaleAbgabe).mockReturnValue(
        Result.error([{ message: "ungültig" }]),
      );
      const onPlanChanged = vi.fn();
      renderPlanerServiceHook({ onPlanChanged });

      expect(onPlanChanged).not.toHaveBeenCalled();
    });

    it("triggers the given callback when specifying an Einkommen", () => {
      vi.mocked(gebeEinkommenAn).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      gebeAnyEinkommenAn(result.current.gebeEinkommenAn);

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });

    it("triggers the given callback when resetting the Plan", () => {
      vi.mocked(setzePlanZurueck).mockReturnValue(ANY_PLAN);
      const onPlanChanged = vi.fn();
      const { result } = renderPlanerServiceHook({ onPlanChanged });

      act(() => result.current.setzePlanZurueck());

      expect(onPlanChanged).toHaveBeenCalledOnce();
      expect(onPlanChanged).toHaveBeenLastCalledWith(ANY_PLAN);
    });
  });
});

function renderPlanerServiceHook(options?: {
  initialInformation?: InitialInformation;
  onPlanChanged?: PlanChangedCallback;
  berrechneElterngeldbezuege?: BerechneElterngeldbezuegeCallback;
}) {
  const initialInformation = options?.initialInformation ?? {
    ausgangslage: ANY_AUSGANGSLAGE,
  };
  const onPlanChanged = options?.onPlanChanged ?? (() => {});
  const berrechneElterngeldbezuege =
    options?.berrechneElterngeldbezuege ?? (() => ANY_ELTERNGELDBEZUEGE);

  return renderHook(
    () =>
      usePlanerService(
        initialInformation,
        onPlanChanged,
        berrechneElterngeldbezuege,
      ),
    {
      preloadedState: INITIAL_STATE,
    },
  );
}

function waehleAnyOption(callback: WaehleOption<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, Variante.Basis));
}

function gebeAnyEinkommenAn(callback: GebeEinkommenAn<Elternteil>) {
  act(() => callback(1, Elternteil.Eins, 300));
}

const ANY_AUSGANGSLAGE = {
  anzahlElternteile: 1 as const,
  pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
  geburtsdatumDesKindes: new Date(),
};

const ANY_ELTERNGELDBEZUG_PRO_VARIANTE = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
};

const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
  [Elternteil.Eins]: ANY_ELTERNGELDBEZUG_PRO_VARIANTE,
  [Elternteil.Zwei]: ANY_ELTERNGELDBEZUG_PRO_VARIANTE,
};

const ANY_ELTERNGELDBEZUEGE = Lebensmonatszahlen.reduce(
  (elterngeldbezuge, lebensmonatszahl) => ({
    ...elterngeldbezuge,
    [lebensmonatszahl]: ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
  }),
  {} as Elterngeldbezuege<Elternteil>,
);

const ANY_PLAN = {
  ausgangslage: ANY_AUSGANGSLAGE,
  errechneteElterngeldbezuege: {} as never,
  lebensmonate: {},
  changes: 0,
  resets: 0,
};

const ANY_VERFUEGBARES_KONTINGENT = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
};

const ANY_VERPLANTES_KONTINGENT = {
  [Variante.Basis]: 0,
  [Variante.Plus]: 0,
  [Variante.Bonus]: 0,
  [KeinElterngeld]: 0,
};

const ANY_LEBENSMONAT = {
  [Elternteil.Eins]: { imMutterschutz: false as const },
  [Elternteil.Zwei]: { imMutterschutz: false as const },
};

const ANY_GESAMTSUMME = {
  elterngeldbezug: 0,
  proElternteil: {
    [Elternteil.Eins]: {
      anzahlMonateMitBezug: 0,
      elterngeldbezug: 0,
      bruttoeinkommen: 0,
    },
    [Elternteil.Zwei]: {
      anzahlMonateMitBezug: 0,
      elterngeldbezug: 0,
      bruttoeinkommen: 0,
    },
  },
};
