import { render, screen } from "@testing-library/react";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Elternteil } from "@/features/planer/user-interface/service";

describe("Kopfleiste mit Pseudonymen", () => {
  it("shows the Pseudonym for each Elternteil", () => {
    render(
      <KopfleisteMitPseudonymen
        pseudonymeDerElternteile={{
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        }}
      />,
    );

    expect(screen.queryByText("Jane")).toBeVisible();
    expect(screen.queryByText("John")).toBeVisible();
  });

  it("shows the Pseudonyme in the correct order", () => {
    render(
      <KopfleisteMitPseudonymen
        pseudonymeDerElternteile={{
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        }}
      />,
    );

    const nameOne = screen.getByText("Jane");
    const nameTwo = screen.getByText("John");

    expect(nameOne.compareDocumentPosition(nameTwo)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
