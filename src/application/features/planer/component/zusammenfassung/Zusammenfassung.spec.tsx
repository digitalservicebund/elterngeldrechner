import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Zusammenfassung } from "./Zusammenfassung";

describe("Zusammenfassung", () => {
  it("shows a section for the Planungsübersicht", () => {
    render(<Zusammenfassung {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planungsübersicht")).toBeVisible();
  });

  it("shows a section for the Planungsdetails", () => {
    render(<Zusammenfassung {...ANY_PROPS} />);

    expect(screen.getByLabelText("Planung der Monate im Detail")).toBeVisible();
  });
});

const ANY_PROPS = {
  plan: {
    ausgangslage: {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate: {},
  },
};
