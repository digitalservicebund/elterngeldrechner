import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElterngeldvariantenRadioButtonGroup } from "./ElterngeldvariantenRadioButtonGroup";

describe("ElterngeldvariantenRadioButtonGroup", () => {
  it("should render a radio input for each Variante", () => {
    render(
      <ElterngeldvariantenRadioButtonGroup
        inputGroupName={ANY_INPUT_GROUP_NAME}
        auszahlungen={ANY_AUSZAHLUNG}
        onChange={ANY_ON_CHANGE_HANDLER}
      />,
    );

    expect(screen.queryByRole("radio", { name: /^Basis/ })).toBeVisible();
    expect(screen.queryByRole("radio", { name: /^Plus/ })).toBeVisible();
    expect(screen.queryByRole("radio", { name: /^Bonus/ })).toBeVisible();
    expect(
      screen.queryByRole("radio", { name: "kein Elterngeld" }),
    ).toBeVisible();
  });

  it("should show the correct Auszahlung in the label of each Variante", () => {
    render(
      <ElterngeldvariantenRadioButtonGroup
        inputGroupName={ANY_INPUT_GROUP_NAME}
        auszahlungen={{ BEG: 1, "EG+": 2, PSB: 3 }}
        onChange={ANY_ON_CHANGE_HANDLER}
      />,
    );

    expect(screen.queryByRole("radio", { name: /^Basis 1 €$/ }));
    expect(screen.queryByRole("radio", { name: /^Plus 2 €$/ }));
    expect(screen.queryByRole("radio", { name: /^Bonus 3 €$/ }));
    expect(screen.queryByRole("radio", { name: /^kein Elterngeld$/ }));
  });

  it("checks the given variant initially", () => {
    render(
      <ElterngeldvariantenRadioButtonGroup
        inputGroupName={ANY_INPUT_GROUP_NAME}
        checkedVariante="EG+"
        auszahlungen={ANY_AUSZAHLUNG}
        onChange={ANY_ON_CHANGE_HANDLER}
      />,
    );

    const input = screen.getByRole("radio", { name: /^Plus/ });

    expect(input).toBeChecked();
  });

  it.each([
    { label: "Basis", value: "BEG" },
    { label: "Plus", value: "EG+" },
    { label: "Bonus", value: "PSB" },
    { label: "kein Elterngeld", value: "None" },
  ])(
    "calls the on change handler with $value as value when the $label radio gets selected",
    async ({ label, value }) => {
      const onChangeHandler = vi.fn();
      render(
        <ElterngeldvariantenRadioButtonGroup
          inputGroupName={ANY_INPUT_GROUP_NAME}
          auszahlungen={ANY_AUSZAHLUNG}
          onChange={onChangeHandler}
        />,
      );

      const input = screen.getByRole("radio", {
        name: new RegExp(`^${label}`),
      });
      await userEvent.click(input);

      expect(onChangeHandler).toHaveBeenCalledOnce();
      expect(onChangeHandler).toHaveBeenLastCalledWith(value);
    },
  );
});

const ANY_INPUT_GROUP_NAME = "test-name";
const ANY_AUSZAHLUNG = {
  BEG: 0,
  "EG+": 0,
  PSB: 0,
  None: 0,
};
const ANY_ON_CHANGE_HANDLER = () => undefined;
