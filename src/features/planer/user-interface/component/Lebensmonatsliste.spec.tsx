import { render, screen } from "@testing-library/react";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import {
  Elternteil,
  KeinElterngeld,
  Lebensmonatszahlen,
  LetzteLebensmonatszahl,
  Variante,
} from "@/features/planer/user-interface/service";

describe("Lebensmonatsliste", () => {
  it("shows a section for Lebensmonate", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    expect(screen.getByLabelText("Lebensmonate")).toBeVisible();
  });

  it("renders a list of all Lebensmonate", () => {
    render(<Lebensmonatsliste {...ANY_PROPS} />);

    Lebensmonatszahlen.forEach((lebensmonatszahl) => {
      expect(
        screen.queryByLabelText(`${lebensmonatszahl}. Lebensmonat`),
      ).toBeInTheDocument();
    });
  });

  it("uses the callback to create unplanned Lebensmonate for missing Lebensmonate", () => {
    const lebensmonate = { 1: ANY_LEBENSMONAT };
    const erstelleUngeplantenLebensmonat = vi
      .fn()
      .mockReturnValue(ANY_LEBENSMONAT);

    render(
      <Lebensmonatsliste
        {...ANY_PROPS}
        lebensmonate={lebensmonate}
        erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
      />,
    );

    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledTimes(
      LetzteLebensmonatszahl - 1,
    );
    expect(erstelleUngeplantenLebensmonat).not.toHaveBeenCalledWith(1);
    expect(erstelleUngeplantenLebensmonat).toHaveBeenCalledWith(2);
  });

  // TODO: The `.toBeVisible()` does not work here because the utility CSS class
  // `hidden` on the parent node is not picked up. We need to inject the actual
  // CSS here with TailwindCSS to make it work.
  test.todo("only shows the first 14 Lebensmonate initially");
  test.todo("can toggle visibility of all Lebensmonate");
});

const ANY_LEBENSMONAT = {
  [Elternteil.Eins]: { imMutterschutz: false as const },
};

const ANY_PROPS = {
  lebensmonate: {},
  pseudonymeDerElternteile: {
    [Elternteil.Eins]: "Jane",
  },
  geburtsdatumDesKindes: new Date(),
  erstelleUngeplantenLebensmonat: () => ANY_LEBENSMONAT,
  bestimmeAuswahlmoeglichkeiten: () => ({
    [Variante.Basis]: { elterngeldbezug: 0, isDisabled: false as const },
    [Variante.Plus]: { elterngeldbezug: 0, isDisabled: false as const },
    [Variante.Bonus]: { elterngeldbezug: 0, isDisabled: false as const },
    [KeinElterngeld]: { elterngeldbezug: null, isDisabled: false as const },
  }),
  waehleOption: () => {},
};
