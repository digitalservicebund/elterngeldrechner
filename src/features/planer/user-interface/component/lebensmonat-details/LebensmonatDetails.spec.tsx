import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LebensmonatDetails } from "./LebensmonatDetails";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("LebensmonateDetails", () => {
  it("shows a details group for the Lebensmonatszahl", () => {
    render(<LebensmonatDetails {...ANY_PROPS} lebensmonatszahl={5} />);

    expect(screen.queryByRole("group", { name: "5. Lebensmonat" }));
  });

  describe("open and close", () => {
    it("opens content when clicking the summary", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;
      const body = screen.getByTestId("details-content");

      expect(body).not.toBeVisible();
      await userEvent.click(summary);
      expect(body).toBeVisible();
      await userEvent.click(summary);
      expect(body).not.toBeVisible();
    });

    it("closes the content when clicking outside", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;
      const body = screen.getByTestId("details-content");
      await userEvent.click(summary);

      expect(body).toBeVisible();
      await userEvent.click(document.body);
      expect(body).not.toBeVisible();
    });
  });
});

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 1, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 1, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_PROPS = {
  lebensmonatszahl: 2 as const,
  lebensmonat: {
    [Elternteil.Eins]: { imMutterschutz: false as const },
    [Elternteil.Zwei]: { imMutterschutz: false as const },
  },
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
    [Elternteil.Zwei]: "John",
  },
  geburtsdatumDesKindes: new Date(),
  bestimmeAuswahlmoeglichkeiten: () => ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
  gebeEinkommenAn: () => {},
};
