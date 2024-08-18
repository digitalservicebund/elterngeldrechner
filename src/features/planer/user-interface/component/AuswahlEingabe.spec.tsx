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

  it("disables disabled Auswahlmöglichkeiten with a hint that can be opened", () => {
    const auswahlmoeglichkeiten = {
      ...ANY_AUSWAHLMOEGLICHKEITEN,
      [Variante.Plus]: {
        isDisabled: true as const,
        hintWhyDisabled: "test hint text",
        elterngeldbezug: 0,
      },
    };

    render(
      <AuswahlEingabe
        {...ANY_PROPS}
        auswahlmoeglichkeiten={auswahlmoeglichkeiten}
      />,
    );

    const input = screen.queryByRole("radio", { name: /Plus/ });

    expect(input).toBeDisabled();
  });

  test.todo("shows a clickable hint related to the disabled input");
});

const ANY_AUSWAHLMOEGLICHKEITEN = {
  [Variante.Basis]: { elterngeldbezug: 0, isDisabled: false as const },
  [Variante.Plus]: { elterngeldbezug: 0, isDisabled: false as const },
  [Variante.Bonus]: { elterngeldbezug: 0, isDisabled: false as const },
  [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
};

const ANY_PROPS = {
  legend: "",
  auswahlmoeglichkeiten: ANY_AUSWAHLMOEGLICHKEITEN,
  waehleOption: () => {},
};
