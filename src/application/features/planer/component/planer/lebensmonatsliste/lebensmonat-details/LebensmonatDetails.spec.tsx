import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LebensmonatDetails } from "./LebensmonatDetails";
import { Elternteil, KeinElterngeld, Variante } from "@/monatsplaner";

describe("LebensmonateDetails", () => {
  it("shows a details group for the Lebensmonatszahl", () => {
    render(<LebensmonatDetails {...ANY_PROPS} lebensmonatszahl={5} />);

    expect(screen.queryByRole("group", { name: "5. Lebensmonat" }));
  });

  describe("open and close", () => {
    it("opens content when clicking the summary", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;

      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
      await userEvent.click(summary);
      expect(screen.getByTestId("details-content")).toBeVisible();
      await userEvent.click(summary);
      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
    });

    it("closes the content when clicking outside", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;

      await userEvent.click(summary);
      expect(screen.getByTestId("details-content")).toBeVisible();
      await userEvent.click(document.body);
      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
    });

    it("triggers the given event handler", async () => {
      const onToggle = vi.fn();
      render(<LebensmonatDetails {...ANY_PROPS} onToggle={onToggle} />);

      const summary = screen.getByRole("group").querySelector("summary")!;

      await userEvent.click(summary);
      await userEvent.click(summary);

      expect(onToggle).toHaveBeenCalledTimes(2);
      expect(onToggle).toHaveBeenNthCalledWith(
        1,
        new ToggleEvent("toggle", { newState: "open", oldState: "closed" }),
      );
      expect(onToggle).toHaveBeenNthCalledWith(
        2,
        new ToggleEvent("toggle", { newState: "closed", oldState: "open" }),
      );
    });
  });
});

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [Variante.Plus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [Variante.Bonus]: { elterngeldbezug: 1, istAuswaehlbar: true as const },
  [KeinElterngeld]: { elterngeldbezug: null, istAuswaehlbar: true as const },
};

const ANY_PROPS = {
  ausgangslage: {
    anzahlElternteile: 2 as const,
    pseudonymeDerElternteile: {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    },
    geburtsdatumDesKindes: new Date(),
  },
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: { imMutterschutz: false as const },
    [Elternteil.Zwei]: { imMutterschutz: false as const },
  },
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};
