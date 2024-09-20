import { render, screen } from "@testing-library/react";
import { AuswahloptionLabel } from "./AuswahloptionLabel";
import { Variante } from "@/features/planer/user-interface/service";

describe("Auswahloption Label", () => {
  it.each([
    { option: Variante.Basis, text: "Basis" },
    { option: Variante.Plus, text: "Plus" },
  ])("shows $text for option $option", ({ option, text }) => {
    render(<AuswahloptionLabel {...ANY_PROPS} option={option} />);

    expect(screen.getByText(text, { exact: false })).toBeVisible();
  });

  it("shows formatted Elterngeldbezug when given", () => {
    render(<AuswahloptionLabel {...ANY_PROPS} elterngeldbezug={100} />);

    expect(screen.getByText("100 €"));
  });

  it("puts the given identifier on the element with the hint why disabled", () => {
    render(
      <AuswahloptionLabel
        {...ANY_PROPS}
        hintWhyDisabled="test hint"
        inputDescriptionIdentifier="test-identifier"
      />,
    );

    expect(screen.getByText("test hint")).toHaveAttribute(
      "id",
      "test-identifier",
    );
  });
});

const ANY_PROPS = {
  option: Variante.Basis,
  elterngeldbezug: 0,
  htmlFor: "",
  inputDescriptionIdentifier: "",
};
