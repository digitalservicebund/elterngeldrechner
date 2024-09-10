import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuswahlEingabe } from "./AuswahlEingabe";
import {
  KeinElterngeld,
  Variante,
} from "@/features/planer/user-interface/service";

describe("AuswahlEingabe", () => {
  it("renders a fieldset with given legend", () => {
    render(<AuswahlEingabe {...ANY_PROPS} legend="test legend" />);

    const fieldset = screen.queryByRole("group", { name: "test legend" });

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

    const basisInput = screen.queryByRole("radio", { name: /^Basis.*10/ });
    const plusInput = screen.queryByRole("radio", { name: /^Plus.*20/ });
    const bonusInput = screen.queryByRole("radio", { name: /^Bonus.*30/ });
    const keinElterngeldInput = screen.queryByRole("radio", {
      name: /^kein Elterngeld$/,
    });

    expect(basisInput).toBeVisible();
    expect(plusInput).toBeVisible();
    expect(bonusInput).toBeVisible();
    expect(keinElterngeldInput).toBeVisible();
  });

  it("renders the radios in a fixed order", () => {
    render(<AuswahlEingabe {...ANY_PROPS} />);

    const basisInput = screen.getByRole("radio", { name: /Basis/ });
    const plusInput = screen.getByRole("radio", { name: /Plus/ });
    const bonusInput = screen.getByRole("radio", { name: /Bonus/ });
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
    { gewaehlteOption: Variante.Basis, label: /Basis/ },
    { gewaehlteOption: Variante.Plus, label: /Plus/ },
    { gewaehlteOption: Variante.Bonus, label: /Bonus/ },
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
    { label: /Basis/, option: Variante.Basis },
    { label: /Plus/, option: Variante.Plus },
    { label: /Bonus/, option: Variante.Bonus },
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
          hintWhyDisabled: "irgendein Grund wieso nicht verfügbar",
          elterngeldbezug: 0,
        },
      };

      render(
        <AuswahlEingabe
          {...ANY_PROPS}
          auswahlmoeglichkeiten={auswahlmoeglichkeiten}
        />,
      );

      const infoButton = screen.getByRole("button", {
        name: "Öffne Informationen wieso ElterngeldPlus nicht verfügbar ist",
      });

      expect(infoButton).toBeVisible();

      await userEvent.click(infoButton);

      expect(
        screen.queryByRole("dialog", {
          name: "Informationen wieso ElterngeldPlus nicht verfügbar ist",
          description: "irgendein Grund wieso nicht verfügbar",
        }),
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
  hintWhyDisabled: "",
  elterngeldbezug: 0,
};

const ANY_PROPS = {
  legend: "",
  auswahlmoeglichkeiten: ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};
