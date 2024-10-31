import userEvent from "@testing-library/user-event";
import ZusammenfassungUndDatenPage from "./ZusammenfassungUndDatenPage";
import { Elternteil } from "@/features/planer/domain";
import { useNavigateWithPlan } from "@/hooks/useNavigateWithPlan";
import { render, screen } from "@/test-utils/test-utils";

vi.mock(import("@/hooks/useNavigateWithPlan"));

describe("Zusammenfassung und Daten Page", () => {
  beforeEach(() => {
    vi.mocked(useNavigateWithPlan).mockReturnValue({
      plan: undefined,
      navigateWithPlanState: () => undefined,
    });
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

    expect(screen.queryByLabelText("Zusammenfassung")).not.toBeInTheDocument();
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

  it("should show the user feedback section", () => {
    render(<ZusammenfassungUndDatenPage />);

    expect(
      screen.getByLabelText(
        "War der Elterngeldrechner mit Planer für Sie hilfreich?",
      ),
    ).toBeVisible();
  });
});

const ANY_PLAN = {
  ausgangslage: {
    anzahlElternteile: 1 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
    },
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonate: {},
  errechneteElterngeldbezuege: {} as never,
};
