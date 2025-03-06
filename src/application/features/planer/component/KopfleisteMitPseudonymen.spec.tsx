import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Elternteil } from "@/monatsplaner";

describe("Kopfleiste mit Pseudonymen", () => {
  it("shows the Pseudonym for each Elternteil", () => {
    const ausgangslage = {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
    };

    render(<KopfleisteMitPseudonymen ausgangslage={ausgangslage} />);

    expect(screen.queryByText("Jane")).toBeVisible();
    expect(screen.queryByText("John")).toBeVisible();
  });

  it("shows the Pseudonyme in the correct order", () => {
    const ausgangslage = {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
    };

    render(<KopfleisteMitPseudonymen ausgangslage={ausgangslage} />);

    const nameOne = screen.getByText("Jane");
    const nameTwo = screen.getByText("John");

    expect(nameOne.compareDocumentPosition(nameTwo)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});

const ANY_GEBURTSDATUM_DES_KINDES = new Date();
