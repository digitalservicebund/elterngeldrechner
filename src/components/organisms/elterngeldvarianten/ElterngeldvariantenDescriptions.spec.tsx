import { screen } from "@testing-library/react";
import { ElterngeldvariantenDescriptions } from "./ElterngeldvariantenDescriptions";
import userEvent from "@testing-library/user-event";
import { render } from "../../../test-utils/test-utils";
import { usePayoutAmounts } from "./usePayoutAmounts";
import { initialStepAllgemeineAngabenState } from "../../../redux/stepAllgemeineAngabenSlice";

jest.mock("./usePayoutAmounts");

/*
 * Notice that the current implicit ARIA roles and attributes for the
 * `<details>` HTML element are not well supported. Thereby it is a little hard
 * to write proper role based queries.
 */
describe("ElterngeldvariantenDescription", () => {
  beforeEach(() => {
    jest.mocked(usePayoutAmounts).mockReturnValue([ANY_PAYOUT_AMOUNTS]);
  });

  it("shows no descriptions when payout amounts are still calculated", () => {
    jest.mocked(usePayoutAmounts).mockReturnValue(undefined);
    render(<ElterngeldvariantenDescriptions />);

    expect(
      screen.queryByText(/Basiselterngeld - 100% Elterngeld/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/ElterngeldPlus - 50% Elterngeld/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/\+ Partnerschaftsbonus/),
    ).not.toBeInTheDocument();
  });

  it("should display a description for each Elterngeldvariante when amounts are calculated", () => {
    jest.mocked(usePayoutAmounts).mockReturnValue([ANY_PAYOUT_AMOUNTS]);
    render(<ElterngeldvariantenDescriptions />);

    expect(
      screen.queryByText(/Basiselterngeld - 100% Elterngeld/),
    ).toBeVisible();
    expect(screen.queryByText(/ElterngeldPlus - 50% Elterngeld/)).toBeVisible();
    expect(screen.queryByText(/\+ Partnerschaftsbonus/)).toBeVisible();
  });

  it("shows details of Basiselterngeld when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/Basiselterngeld - 100% Elterngeld/);

    await userEvent.click(summary);

    const details = screen.getByText(
      /Mit dem Basiselterngeld können Sie insgesamt bis zu 12 Monate Elternzeit nehmen/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of ElterngeldPlus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/ElterngeldPlus - 50% Elterngeld/);

    await userEvent.click(summary);

    const details = screen.getByText(/Halb so hoch wie Basiselterngel/);
    expect(details).toBeVisible();
  });

  it("shows details of + Partnerschaftsbonus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/\+ Partnerschaftsbonus/);

    await userEvent.click(summary);

    const details = screen.getByText(
      /Die Eltern nutzen den Partnerschaftsbonus gleichzeitig/,
    );
    expect(details).toBeVisible();
  });

  it("shows the names and payout amounts for each parent and variants if both apply together", () => {
    jest.mocked(usePayoutAmounts).mockReturnValue([
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
    jest.mocked(usePayoutAmounts).mockReturnValue([
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
          antragstellende: "EinElternteil",
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
