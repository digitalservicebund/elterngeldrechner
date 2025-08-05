import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";

describe("Validierungsfehlerbox", () => {
  it("shows a section for the Validierungsfehler", () => {
    render(<Validierungsfehlerbox validierungsfehler={[]} />);

    expect(screen.getByLabelText("Validierungsfehler")).toBeVisible();
  });

  it("shows a list with all Fehlernachrichten as entries", () => {
    const fehlerNachrichten = ["erster Fehler", "noch was falsch"];
    render(<Validierungsfehlerbox validierungsfehler={fehlerNachrichten} />);

    expect(screen.getByText("erster Fehler")).toBeVisible();
    expect(screen.getByText("noch was falsch")).toBeVisible();
  });
});
