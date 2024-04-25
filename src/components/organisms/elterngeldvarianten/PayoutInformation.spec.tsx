import { render, screen } from "@testing-library/react";
import { PayoutInformation } from "./PayoutInformation";

describe("PaymentInformation", () => {
  it("displays the name of the parent receiving the payout", () => {
    render(
      <PayoutInformation
        parentName="Jane"
        amount={ANY_AMOUNT}
        testLocales={ANY_LOCALES}
      />,
    );

    expect(screen.queryByText("Jane", { exact: false })).toBeVisible();
  });

  it("displays the amount as currency with Euro symbol", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={ANY_AMOUNT}
        testLocales={ANY_LOCALES}
      />,
    );

    expect(screen.queryByText("€", { exact: false })).toBeVisible();
  });

  it("displays the amount with a accuracy of zero fractional digits and floors the value", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={10.5}
        testLocales="de-DE"
      />,
    );

    expect(screen.queryByText("10", { exact: false })).toBeVisible();
    expect(
      screen.queryByText("10,5", { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("displays the amount with thousands operator", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={10000}
        testLocales="de-DE"
      />,
    );

    expect(screen.getByText("10.000", { exact: false })).toBeVisible();
  });
});

const ANY_NAME = "Jane";
const ANY_AMOUNT = 10;
const ANY_LOCALES = "de-DE";
