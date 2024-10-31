import { fireEvent, render, screen } from "@testing-library/react";
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

      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
      await clickOnElementWithToggleEvent(summary);
      expect(screen.getByTestId("details-content")).toBeVisible();
      await clickOnElementWithToggleEvent(summary);
      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
    });

    it("closes the content when clicking outside", async () => {
      render(<LebensmonatDetails {...ANY_PROPS} />);

      const summary = screen.getByRole("group").querySelector("summary")!;

      await clickOnElementWithToggleEvent(summary);
      expect(screen.getByTestId("details-content")).toBeVisible();
      await clickOnElementWithToggleEvent(document.body);
      expect(screen.queryByTestId("details-content")).not.toBeInTheDocument();
    });

    /**
     * This fixes JSDOM by firing ToggleEvents with an click action. After
     * a click, the details element is checked for its open attribute to
     * determine if it was opened or closed by the former click. Then a toggle
     * event is fired on the details event like it would in a web-browser.
     *
     * Can be deleted once JSDOM has implemented support for this.
     */
    async function clickOnElementWithToggleEvent(
      element: Element,
    ): Promise<void> {
      await userEvent.click(element);

      const details = screen.getByRole("group");
      const isOpen = details.getAttribute("open") != null;
      const event = new ToggleEvent("toggle", {
        newState: isOpen ? "open" : "closed",
      });
      fireEvent(details, event);
    }
  });
});

/**
 * Partial implementation of the actual ToggleEvent in web-browsers to fake
 * toggling events.
 */
class ToggleEvent extends Event {
  public readonly newState: "open" | "closed";

  constructor(type: "toggle", init: { newState: "open" | "closed" }) {
    super(type);
    this.newState = init.newState;
  }
}

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
  erstelleVorschlaegeFuerAngabeDesEinkommens: () => [],
  gebeEinkommenAn: () => {},
};
