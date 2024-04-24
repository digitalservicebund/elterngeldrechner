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

    expect(screen.getByText("Jane", { exact: false })).toBeVisible();
  });

  it("displays the amount as currency with Euro symbol", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={ANY_AMOUNT}
        testLocales={ANY_LOCALES}
      />,
    );

    expect(screen.getByText("€", { exact: false })).toBeVisible();
  });

  it("displays the amount with a accuracy of two fractional digits", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={10.5}
        testLocales="de-DE"
      />,
    );

    expect(screen.getByText("10,5", { exact: false })).toBeVisible();
  });

  it("displays the amount with thousands operator", () => {
    render(
      <PayoutInformation
        parentName={ANY_NAME}
        amount={10000}
        testLocales="de-DE"
      />,
    );

    expect(screen.getByText("10.000,00", { exact: false })).toBeVisible();
  });
});

const ANY_NAME = "Jane";
const ANY_AMOUNT = 10;
const ANY_LOCALES = "de-DE";
