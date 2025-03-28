import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZusammenfassungUndDatenPage } from "./ZusammenfassungUndDatenPage";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { render, screen } from "@/application/test-utils";

describe("Zusammenfassung und Daten Page", () => {
  beforeEach(async () => {
    vi.spyOn(await import("./useNavigateWithPlan"), "useNavigateWithPlan");
  });

  it("shows a section for the Zusammenfassung if a Plan was provided", () => {
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: ANY_PLAN,
      navigateWithPlanState: () => undefined,
    });

    render(<ZusammenfassungUndDatenPage />);

    expect(screen.getByLabelText("Zusammenfassung")).toBeVisible();
  });

  it("shows hint instead of Zusammenfassung when no Plan was provided", () => {
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: undefined,
      navigateWithPlanState: () => undefined,
    });

    render(<ZusammenfassungUndDatenPage />);

    expect(screen.getByText("Es wurde noch kein Plan erstellt"));
  });

  it("uses the existing Plan when navigating back to the Rechner", async () => {
    const navigateWithPlanState = vi.fn();
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: ANY_PLAN,
      navigateWithPlanState,
    });

    render(<ZusammenfassungUndDatenPage />);

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
