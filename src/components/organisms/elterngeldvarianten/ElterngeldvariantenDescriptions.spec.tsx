import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElterngeldvariantenDescriptions } from "./ElterngeldvariantenDescriptions";
import { usePayoutAmounts } from "./usePayoutAmounts";
import { render } from "@/test-utils/test-utils";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";

vi.mock("./usePayoutAmounts");

/*
 * Notice that the current implicit ARIA roles and attributes for the
 * `<details>` HTML element are not well supported. Thereby it is a little hard
 * to write proper role based queries.
 */
describe("ElterngeldvariantenDescription", () => {
  beforeEach(() => {
    vi.mocked(usePayoutAmounts).mockReturnValue([ANY_PAYOUT_AMOUNTS]);
  });

  it("shows no descriptions when payout amounts are still calculated", () => {
    vi.mocked(usePayoutAmounts).mockReturnValue(undefined);
    render(<ElterngeldvariantenDescriptions />);

    expect(
      screen.queryByRole("heading", {
        name: "Basiselterngeld (14 Monate verfügbar)",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "ElterngeldPlus (28 Monate verfügbar)",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "+ Partnerschaftsbonus (4 Monate verfügbar)",
      }),
    ).not.toBeInTheDocument();
  });

  it("should display a description for each Elterngeldvariante when amounts are calculated", () => {
    vi.mocked(usePayoutAmounts).mockReturnValue([ANY_PAYOUT_AMOUNTS]);
    render(<ElterngeldvariantenDescriptions />);

    expect(
      screen.queryByRole("heading", {
        name: "Basiselterngeld (14 Monate verfügbar)",
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", {
        name: "ElterngeldPlus (28 Monate verfügbar)",
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", {
        name: "+ Partnerschaftsbonus (4 Monate verfügbar)",
      }),
    ).toBeVisible();
  });

  it("shows details of Basiselterngeld when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "Basiselterngeld (14 Monate verfügbar)",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Als Basiselterngeld bekommen Sie normalerweise 65 Prozent des Nettoeinkommens,/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of ElterngeldPlus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "ElterngeldPlus (28 Monate verfügbar)",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Statt eines Lebensmonats Basiselterngeld können Sie 2 Lebensmonate ElterngeldPlus bekommen/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of Partnerschaftsbonus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "+ Partnerschaftsbonus (4 Monate verfügbar)",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Für den Partnerschaftsbonus muss man 24 bis 32 Stunden pro Woche in Teilzeit arbeiten/,
    );
    expect(details).toBeVisible();
  });

  it("shows the names and payout amounts for each parent and variants if both apply together", () => {
    vi.mocked(usePayoutAmounts).mockReturnValue([
      {
        name: "Jane",
        basiselterngeld: 1,
        elterngeldplus: 2,
        partnerschaftsbonus: 3,
      },
      {
        name: "John",
        basiselterngeld: 4,
        elterngeldplus: 5,
        partnerschaftsbonus: 6,
      },
    ]);
    render(<ElterngeldvariantenDescriptions />, {
      preloadedState: {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "FuerBeide",
        },
      },
    });

    expect(screen.queryAllByText(/Jane/)).toHaveLength(3);
    expect(screen.queryAllByText(/John/)).toHaveLength(3);
    expect(screen.queryByText(/1 €/)).toBeVisible();
    expect(screen.queryByText(/2 €/)).toBeVisible();
    expect(screen.queryByText(/3 €/)).toBeVisible();
    expect(screen.queryByText(/4 €/)).toBeVisible();
    expect(screen.queryByText(/5 €/)).toBeVisible();
    expect(screen.queryByText(/6 €/)).toBeVisible();
  });

  it("shows no name if single applicant", () => {
    vi.mocked(usePayoutAmounts).mockReturnValue([
      {
        name: "Jane",
        basiselterngeld: 1,
        elterngeldplus: 2,
        partnerschaftsbonus: 3,
      },
    ]);
    render(<ElterngeldvariantenDescriptions />, {
      preloadedState: {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "EinenElternteil",
        },
      },
    });

    expect(screen.queryAllByText(/Jane/)).toHaveLength(0);
  });
});

const ANY_PAYOUT_AMOUNTS = {
  name: "Jane",
  basiselterngeld: 0,
  elterngeldplus: 0,
  partnerschaftsbonus: 0,
};
