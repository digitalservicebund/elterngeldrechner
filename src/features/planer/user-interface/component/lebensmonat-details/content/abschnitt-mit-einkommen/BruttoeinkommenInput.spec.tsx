import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";

describe("Buttoeinkommen Input", () => {
  it("shows an input for the Bruttoeinkommen with given ariaLabel", () => {
    render(<BruttoeinkommenInput {...ANY_PROPS} ariaLabel="test aria label" />);

    expect(
      screen.getByRole("textbox", { name: "test aria label" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Einkommen in €")).toBeVisible();
  });

  it("uses the given Bruttoeinkommen as input value", () => {
    render(<BruttoeinkommenInput {...ANY_PROPS} bruttoeinkommen={251} />);

    expect(screen.getByRole("textbox")).toHaveValue("251");
  });

  it("triggers the callback when typing numbers", async () => {
    const gebeEinkommenAn = vi.fn();
    render(
      <BruttoeinkommenInput {...ANY_PROPS} gebeEinkommenAn={gebeEinkommenAn} />,
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "2");

    expect(gebeEinkommenAn).toHaveBeenCalledOnce();
    expect(gebeEinkommenAn).toHaveBeenLastCalledWith(2);
  });

  it("does not trigger the callback when typing a character or symbol", async () => {
    const gebeEinkommenAn = vi.fn();
    render(
      <BruttoeinkommenInput {...ANY_PROPS} gebeEinkommenAn={gebeEinkommenAn} />,
    );

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "a!}.-");

    expect(gebeEinkommenAn).not.toHaveBeenCalledOnce();
  });
});

const ANY_PROPS = {
  ariaLabel: "",
  gebeEinkommenAn: () => {},
};
