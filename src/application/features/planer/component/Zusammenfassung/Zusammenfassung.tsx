import classNames from "classnames";
import { ReactNode } from "react";
import { AbschnittMitPlanungsdetails } from "./AbschnittMitPlanungsdetails";
import { AbschnittMitPlanungsuebersicht } from "./AbschnittMitPlanungsuebersicht";
import { type PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly className?: string;
};

export function Zusammenfassung({ plan, className }: Props): ReactNode {
  return (
    <div
      className={classNames("flex flex-col gap-y-80 print:gap-y-20", className)}
    >
      <AbschnittMitPlanungsuebersicht plan={plan} />
      <AbschnittMitPlanungsdetails plan={plan} />
    </div>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Zusammenfassung", async () => {
    const { render, screen } = await import("@testing-library/react");

    it("shows a section for the Planungsübersicht", () => {
      render(<Zusammenfassung {...ANY_PROPS} />);

      expect(screen.getByLabelText("Planungsübersicht")).toBeVisible();
    });

    it("shows a section for the Planungsdetails", () => {
      render(<Zusammenfassung {...ANY_PROPS} />);

      expect(
        screen.getByLabelText("Planung der Monate im Detail"),
      ).toBeVisible();
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
}
