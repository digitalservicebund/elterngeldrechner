import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DatenuebernahmeAntragPage } from "./DatenuebernahmeAntragPage";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { bundeslaender } from "@/application/features/pdfAntrag";
import { INITIAL_STATE, render, screen } from "@/application/test-utils";

describe("Datenuebernahme Antrag Page", () => {
  beforeEach(async () => {
    vi.spyOn(await import("./useNavigateWithPlan"), "useNavigateWithPlan");
  });

  it("shows a section for the Datenuebernahme Antrag with option to download pdf if a Plan was provided and Bundesland is supported", () => {
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: ANY_PLAN,
      navigateWithPlanState: () => undefined,
    });

    render(<DatenuebernahmeAntragPage />, { preloadedState: initialTestState });

    expect(
      screen.getByLabelText(
        "Übernahme Planung in den PDF Antrag auf Elterngeld",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Antrag_auf_Elterngeld.pdf" }),
    ).toBeVisible();
  });

  it("shows a section for the Datenuebernahme Antrag with links instead of option to download pdf if a Plan was provided and Bundesland is unsupported", () => {
    const state = produce(initialTestState, (draft) => {
      draft.stepAllgemeineAngaben.bundesland = bundeslaender[0].name;
    });

    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: ANY_PLAN,
      navigateWithPlanState: () => undefined,
    });

    render(<DatenuebernahmeAntragPage />, { preloadedState: state });

    expect(
      screen.getByLabelText(
        "Übernahme Planung in den PDF Antrag auf Elterngeld",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Die automatische Übernahme Ihrer Elterngeld-Planung ist nur im bundeseinheitlichen Antrag möglich.",
      ),
    ).toBeVisible();
  });

  it("uses the existing Plan when navigating back to the Rechner", async () => {
    const navigateWithPlanState = vi.fn();
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: ANY_PLAN,
      navigateWithPlanState,
    });

    render(<DatenuebernahmeAntragPage />, { preloadedState: initialTestState });

    const button = screen.getByRole("button", { name: "Zurück" });
    await userEvent.click(button);

    expect(navigateWithPlanState).toHaveBeenCalledOnce();
    expect(navigateWithPlanState).toHaveBeenLastCalledWith(
      "/rechner-planer",
      ANY_PLAN,
    );
  });
});

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonate: {},
};

const initialTestState = produce(INITIAL_STATE, (draft) => {
  draft.stepAllgemeineAngaben.bundesland = bundeslaender[2].name;
  draft.stepAllgemeineAngaben.pseudonym = {
    ET1: "Elternteil 1",
    ET2: "Elternteil 2",
  };
  draft.stepNachwuchs.anzahlKuenftigerKinder = 1;
  draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "01.01.2100";
});
