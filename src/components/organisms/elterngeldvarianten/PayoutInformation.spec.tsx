import { render, screen } from "@testing-library/react";
import { PayoutInformation } from "./PayoutInformation";

describe("PaymentInformation", () => {
  it("displays the name of the parent with separator sign", () => {
    render(<PayoutInformation name="Jane" amount={ANY_AMOUNT} />);

    expect(screen.queryByText("Jane |", { exact: false })).toBeVisible();
  });

  it("does not display a separator sign if no parent name given", () => {
    render(<PayoutInformation name={undefined} amount={ANY_AMOUNT} />);

    expect(screen.queryByText("|", { exact: false })).not.toBeInTheDocument();
  });

  it("displays the amount as currency with Euro symbol", () => {
    render(<PayoutInformation name={ANY_NAME} amount={ANY_AMOUNT} />);

    expect(screen.queryByText("€", { exact: false })).toBeVisible();
  });

  it("displays the amount with a accuracy of zero fractional digits and floors the value", () => {
    render(<PayoutInformation name={ANY_NAME} amount={10.5} />);

    expect(screen.queryByText("10", { exact: false })).toBeVisible();
    expect(
      screen.queryByText("10,5", { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("displays the amount with thousands operator", () => {
    render(<PayoutInformation name={ANY_NAME} amount={10000} />);

    expect(screen.getByText("10.000", { exact: false })).toBeVisible();
  });
});

const ANY_NAME = "Jane";
const ANY_AMOUNT = 10;
