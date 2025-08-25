import type { ReactNode } from "react";

type Props = {
  readonly betrag: number;
  readonly className?: string;
};

export function Geldbetrag({ betrag, className }: Props): ReactNode {
  const gerundeterBetrag = Math.round(betrag);
  const formattedBetrag = gerundeterBetrag.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });

  return className ? (
    <span className={className}>{formattedBetrag}</span>
  ) : (
    formattedBetrag
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Geldbetrag", async () => {
    const { render, screen } = await import("@testing-library/react");

    it("shows the given Betrag with Euro currency symbol", () => {
      render(<Geldbetrag betrag={123} />);

      expect(screen.getByText("123 €")).toBeVisible();
    });

    it("does not show any fraction digits", () => {
      render(<Geldbetrag betrag={12.34} />);

      expect(screen.getByText("12 €")).toBeVisible();
    });

    it.each([
      { betrag: 1, gerundet: 1 },
      { betrag: 1.4, gerundet: 1 },
      { betrag: 1.5, gerundet: 2 },
      { betrag: 1.6, gerundet: 2 },
      { betrag: 2, gerundet: 2 },
    ])("rounds an Betrag of $betrag to $gerundet", ({ betrag, gerundet }) => {
      render(<Geldbetrag betrag={betrag} />);

      expect(screen.getByText(`${gerundet} €`)).toBeVisible();
    });
  });
}
