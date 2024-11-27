import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuswahlEingabe } from "./AuswahlEingabe";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("AuswahlEingabe", () => {
  it("renders a fieldset with given legend", () => {
    render(<AuswahlEingabe {...ANY_PROPS} legend="test legend" />);

    const fieldset = screen.getByRole("radiogroup", { name: "test legend" });

    expect(fieldset).toBeVisible();
  });

  it("renders a radio per Auswahlmöglichkeit including its Elterngeldbezug in the label", () => {
    const auswahlmoeglichkeiten = {
      [Variante.Basis]: { elterngeldbezug: 10, isDisabled: false as const },
      [Variante.Plus]: { elterngeldbezug: 20, isDisabled: false as const },
      [Variante.Bonus]: { elterngeldbezug: 30, isDisabled: false as const },
      [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
    };

    render(
      <AuswahlEingabe
        {...ANY_PROPS}
        auswahlmoeglichkeiten={auswahlmoeglichkeiten}
      />,
    );

    expect(
      screen.getByRole("radio", {
        name: "Basiselterngeld mit 10 €",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "ElterngeldPlus mit 20 €",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "Partnerschaftsbonus mit 30 €",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "kein Elterngeld",
      }),
    ).toBeInTheDocument();
  });

  it("renders the radios in a fixed order", () => {
    render(<AuswahlEingabe {...ANY_PROPS} />);

    const basisInput = screen.getByRole("radio", { name: /Basiselterngeld/ });
    const plusInput = screen.getByRole("radio", { name: /ElterngeldPlus/ });
    const bonusInput = screen.getByRole("radio", {
      name: /Partnerschaftsbonus/,
    });
    const keinElterngeldInput = screen.getByRole("radio", {
      name: /kein Elterngeld/,
    });

    expect(basisInput?.compareDocumentPosition(plusInput)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(plusInput?.compareDocumentPosition(bonusInput)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(bonusInput?.compareDocumentPosition(keinElterngeldInput)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it.each([
    { gewaehlteOption: Variante.Basis, label: /Basiselterngeld/ },
    { gewaehlteOption: Variante.Plus, label: /ElterngeldPlus/ },
    { gewaehlteOption: Variante.Bonus, label: /Partnerschaftsbonus/ },
    { gewaehlteOption: KeinElterngeld, label: /kein Elterngeld/ },
  ])(
    "checks the gewählte Option $gewaehlteOption initially",
    ({ gewaehlteOption, label }) => {
      render(
        <AuswahlEingabe {...ANY_PROPS} gewaehlteOption={gewaehlteOption} />,
      );

      const input = screen.getByRole("radio", { name: label });

      expect(input).toBeChecked();
    },
  );

  it.each([
    { label: /Basiselterngeld/, option: Variante.Basis },
    { label: /ElterngeldPlus/, option: Variante.Plus },
    { label: /Partnerschaftsbonus/, option: Variante.Bonus },
    { label: /kein Elterngeld/, option: KeinElterngeld },
  ])(
    "calls the callback with Option $option when checking the input for $label",
    async ({ label, option }) => {
      const waehleOption = vi.fn();
      render(<AuswahlEingabe {...ANY_PROPS} waehleOption={waehleOption} />);

      const input = screen.getByRole("radio", { name: label });
      await userEvent.click(input);

      expect(waehleOption).toHaveBeenCalledOnce();
      expect(waehleOption).toHaveBeenLastCalledWith(option);
    },
  );

  describe("disabled Auswahlmöglicheiten", () => {
    it("marks radio button as disabled but keeps it focusable", () => {
      const auswahlmoeglichkeiten = {
        ...ANY_AUSWAHLMOEGLICHKEITEN,
        [Variante.Plus]: ANY_DISABLED_AUSWAHLMOEGLICHKEIT,
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      const input = screen.getByRole("radio", { name: /Plus/ });

      expect(input).not.toBeDisabled();
      expect(input).toHaveAttribute("aria-disabled", "true");
    });

    it("does not call the callback when clicked", async () => {
      const waehleOption = vi.fn();
      const auswahlmoeglichkeiten = {
        ...ANY_AUSWAHLMOEGLICHKEITEN,
        [Variante.Plus]: ANY_DISABLED_AUSWAHLMOEGLICHKEIT,
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          waehleOption={waehleOption}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      const input = screen.getByRole("radio", { name: /Plus/ });
      await userEvent.click(input);

      expect(waehleOption).not.toHaveBeenCalled();
    });

    it("povides an info dialog with information why it is disabled", async () => {
      const auswahlmoeglichkeiten = {
        ...ANY_AUSWAHLMOEGLICHKEITEN,
        [Variante.Plus]: {
          isDisabled: true as const,
          hintWhyDisabled: "ist nicht mehr verfügbar",
          elterngeldbezug: 0,
        },
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", {
          name: "Öffne Informationen wieso ElterngeldPlus nicht verfügbar ist",
        }),
      );

      const dialog = screen.getByLabelText(
        "Informationen wieso ElterngeldPlus nicht verfügbar ist",
      );

      expect(
        within(dialog).getByText("ist nicht mehr verfügbar"),
      ).toBeVisible();
    });

    it("provides the disabled hint as description property and links to info dialog", () => {
      const auswahlmoeglichkeiten = {
        ...ANY_AUSWAHLMOEGLICHKEITEN,
        [Variante.Plus]: {
          isDisabled: true as const,
          hintWhyDisabled: "ist nicht mehr verfügbar",
          elterngeldbezug: 0,
        },
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      const input = screen.getByRole("radio", {
        name: /ElterngeldPlus/,
        description: "ist nicht mehr verfügbar",
      });

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-details");
    });

    it("puts all disabled hint buttons before the first radio in the tab order", () => {
      const auswahlmoeglichkeiten = {
        ...ANY_AUSWAHLMOEGLICHKEITEN,
        [Variante.Basis]: ANY_DISABLED_AUSWAHLMOEGLICHKEIT,
        [Variante.Bonus]: ANY_DISABLED_AUSWAHLMOEGLICHKEIT,
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      const basisInfoButton = screen.getByRole("button", {
        name: "Öffne Informationen wieso Basiselterngeld nicht verfügbar ist",
      });
      const plusInfoButton = screen.getByRole("button", {
        name: "Öffne Informationen wieso Partnerschaftsbonus nicht verfügbar ist",
      });
      const firstRadio = screen.getAllByRole("radio")[0];

      expect(basisInfoButton?.compareDocumentPosition(plusInfoButton)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(plusInfoButton?.compareDocumentPosition(firstRadio)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });
});

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 0, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 0, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 0, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_DISABLED_AUSWAHLMOEGLICHKEIT = {
  isDisabled: true as const,
  hintWhyDisabled: "test hint",
  elterngeldbezug: 0,
};

const ANY_PROPS = {
  legend: "",
  elternteil: Elternteil.Eins,
  auswahlmoeglichkeiten: ANY_AUSWAHLMOEGLICHKEITEN,
  imMutterschutz: false,
  waehleOption: () => {},
};
