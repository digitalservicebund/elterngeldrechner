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
    jest.mocked(usePayoutAmounts).mockReturnValue(ANY_PAYOUT_AMOUNT);
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
    jest.mocked(usePayoutAmounts).mockReturnValue(ANY_PAYOUT_AMOUNT);
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

  it("shows names of the parents for each variants payout information", () => {
    render(<ElterngeldvariantenDescriptions />, {
      preloadedState: {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          pseudonym: { ET1: "Jane", ET2: "John" },
        },
      },
    });

    expect(screen.queryAllByText(/Jane/)).toHaveLength(3);
    expect(screen.queryAllByText(/John/)).toHaveLength(3);
  });

  it("shows the calculated amounts for each variants payout information", () => {
    jest.mocked(usePayoutAmounts).mockReturnValue({
      basiselterngeld: { ET1: 1.0, ET2: 2.0 },
      elterngeldplus: { ET1: 3.0, ET2: 4.0 },
      partnerschaftsbonus: { ET1: 5.0, ET2: 6.0 },
    });
    render(<ElterngeldvariantenDescriptions />);

    expect(screen.queryByText(/1.00/)).toBeVisible();
    expect(screen.queryByText(/2.00/)).toBeVisible();
    expect(screen.queryByText(/3.00/)).toBeVisible();
    expect(screen.queryByText(/4.00/)).toBeVisible();
    expect(screen.queryByText(/5.00/)).toBeVisible();
    expect(screen.queryByText(/6.00/)).toBeVisible();
  });
});

const ANY_PAYOUT_AMOUNT = {
  basiselterngeld: { ET1: 0, ET2: 0 },
  elterngeldplus: { ET1: 0, ET2: 0 },
  partnerschaftsbonus: { ET1: 0, ET2: 0 },
};
