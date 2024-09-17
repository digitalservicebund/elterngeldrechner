import { render, screen } from "@testing-library/react";
import { Zusammenfassung } from "./Zusammenfassung";
import { Elternteil } from "@/features/planer/user-interface/service";

describe("Zusammenfassung", () => {
  it("shows a section for the Zusammenfassung", () => {
    render(<Zusammenfassung {...ANY_PROPS} />);

    expect(screen.getByLabelText("Zusammenfassung")).toBeVisible();
  });

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
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
      },
      geburtsdatumDesKindes: new Date(),
    },
    lebensmonate: {},
    errechneteElterngeldbezuege: {} as any,
  },
};
