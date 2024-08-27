import { render, screen } from "@testing-library/react";
import { SummationFooter } from "./SummationFooter";

describe("SummationFooter", () => {
  it("displays a footer with the label 'Gesamtsumme'", () => {
    render(<SummationFooter data={[ANY_SUMMATION_OF_PARENT_DATA_A]} />);

    const footer = screen.queryByRole("contentinfo", { name: "Gesamtsumme" });

    expect(footer).toBeVisible();
  });

  it("shows the given parent names in correct order", () => {
    render(
      <SummationFooter
        data={[
          { ...ANY_SUMMATION_OF_PARENT_DATA_A, name: "Jane" },
          { ...ANY_SUMMATION_OF_PARENT_DATA_B, name: "John" },
        ]}
      />,
    );

    const firstName = screen.queryByText(/Jane/);
    const secondName = screen.queryByText(/John/);

    expect(firstName).toBeVisible();
    expect(secondName).toBeVisible();
    expect(firstName?.compareDocumentPosition(secondName!)).toEqual(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("shows the given month counts with correct grammatrical number in order", () => {
    render(
      <SummationFooter
        data={[
          { ...ANY_SUMMATION_OF_PARENT_DATA_A, monthCount: 1 },
          { ...ANY_SUMMATION_OF_PARENT_DATA_B, monthCount: 2 },
        ]}
      />,
    );

    const firstMonthCount = screen.queryByText("1 Monat");
    const secondMonthCount = screen.queryByText("2 Monate");

    expect(firstMonthCount).toBeVisible();
    expect(secondMonthCount).toBeVisible();
    expect(firstMonthCount?.compareDocumentPosition(secondMonthCount!)).toEqual(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("shows the given total payout amounts correctly formatted in order", () => {
    render(
      <SummationFooter
        data={[
          { ...ANY_SUMMATION_OF_PARENT_DATA_A, totalPayoutAmount: 1000 },
          { ...ANY_SUMMATION_OF_PARENT_DATA_B, totalPayoutAmount: 900.5 },
        ]}
      />,
    );

    const firstTotalPayoutAmount = screen.queryByText("Elterngeld: 1.000 €");
    const secondTotalPayoutAmount = screen.queryByText("Elterngeld: 901 €");

    expect(firstTotalPayoutAmount).toBeVisible();
    expect(secondTotalPayoutAmount).toBeVisible();
    expect(
      firstTotalPayoutAmount?.compareDocumentPosition(secondTotalPayoutAmount!),
    ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("shows the given income amounts correctly formatted in order", () => {
    render(
      <SummationFooter
        data={[
          { ...ANY_SUMMATION_OF_PARENT_DATA_A, totalIncomeAmount: 1300.5 },
          { ...ANY_SUMMATION_OF_PARENT_DATA_B, totalIncomeAmount: 1200 },
        ]}
      />,
    );

    const firstTotalIncomeAmount = screen.queryByText("Einkommen: 1.301 €");
    const secondTotalIncomeAmount = screen.queryByText("Einkommen: 1.200 €");

    expect(firstTotalIncomeAmount).toBeVisible();
    expect(secondTotalIncomeAmount).toBeVisible();
    expect(
      firstTotalIncomeAmount?.compareDocumentPosition(secondTotalIncomeAmount!),
    ).toEqual(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("sums up the total amounts for each parent", () => {
    render(
      <SummationFooter
        data={[
          {
            ...ANY_SUMMATION_OF_PARENT_DATA_A,
            totalPayoutAmount: 1000,
            totalIncomeAmount: 1300.5,
          },
          {
            ...ANY_SUMMATION_OF_PARENT_DATA_B,
            totalPayoutAmount: 900,
            totalIncomeAmount: 1200,
          },
        ]}
      />,
    );

    const firstTotalSum = screen.queryByText("Summe: 2.301 €");
    const secondTotalSum = screen.queryByText("Summe: 2.100 €");

    expect(firstTotalSum).toBeVisible();
    expect(secondTotalSum).toBeVisible();
    expect(firstTotalSum?.compareDocumentPosition(secondTotalSum!)).toEqual(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("adds all amounts of both parents as final sum", () => {
    render(
      <SummationFooter
        data={[
          {
            ...ANY_SUMMATION_OF_PARENT_DATA_A,
            totalPayoutAmount: 1000,
            totalIncomeAmount: 1300.5,
          },
          {
            ...ANY_SUMMATION_OF_PARENT_DATA_B,
            totalPayoutAmount: 900,
            totalIncomeAmount: 1200,
          },
        ]}
      />,
    );

    const finalSum = screen.queryByText("Gesamtsumme der Planung: 4.401 €");

    expect(finalSum).toBeVisible();
  });

  it("works for a single parent where hiding the name and no intermediate sum", () => {
    render(
      <SummationFooter
        data={[
          {
            name: "Jane",
            monthCount: 5,
            totalPayoutAmount: 2000,
            totalIncomeAmount: 1000,
          },
        ]}
      />,
    );

    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    expect(screen.queryByText("5 Monate")).toBeVisible();
    expect(screen.queryByText("Elterngeld: 2.000 €")).toBeVisible();
    expect(screen.queryByText("Einkommen: 1.000 €")).toBeVisible();
    expect(screen.queryByText("Summe: 3.000 €")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Gesamtsumme der Planung: 3.000 €"),
    ).toBeVisible();
  });
});

// Use a A and B dataset to "enforce" different names, which are used as key
// values. Else React will complain about duplicated keys.
const ANY_SUMMATION_OF_PARENT_DATA_A = {
  name: "Jane",
  monthCount: 1,
  totalPayoutAmount: 1,
  totalIncomeAmount: 1,
};

const ANY_SUMMATION_OF_PARENT_DATA_B = {
  ...ANY_SUMMATION_OF_PARENT_DATA_A,
  name: "John",
};
