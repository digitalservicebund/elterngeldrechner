import { render, screen, within } from "@testing-library/react";
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

    const list = screen.getByRole("list", {
      name: "Liste mit Validierungsfehler",
    });
    const items = within(list).getAllByRole("listitem");

    expect(items.length).toBe(2);
    expect(within(items[0]!).queryByText("erster Fehler")).toBeVisible();
    expect(within(items[1]!).queryByText("noch was falsch")).toBeVisible();
  });
});
