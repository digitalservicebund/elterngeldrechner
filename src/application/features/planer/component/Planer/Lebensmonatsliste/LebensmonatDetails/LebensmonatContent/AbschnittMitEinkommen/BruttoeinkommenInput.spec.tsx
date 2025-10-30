import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";

describe("Buttoeinkommen Input", () => {
  it("shows an input for the Bruttoeinkommen with given ariaLabel", () => {
    render(<BruttoeinkommenInput {...ANY_PROPS} ariaLabel="test aria label" />);

    expect(
      screen.getByRole("combobox", { name: "test aria label" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Einkommen in € (brutto)")).toBeVisible();
    expect(screen.getByTestId("BusinessCenterOutlinedIcon")).toBeVisible();
  });

  it("uses the given Bruttoeinkommen as input value", () => {
    render(<BruttoeinkommenInput {...ANY_PROPS} bruttoeinkommen={251} />);

    expect(screen.getByRole("combobox")).toHaveValue("251");
  });

  it("uses the given Vorschläge as input suggestions", () => {
    render(<BruttoeinkommenInput {...ANY_PROPS} vorschlaege={[70, 53]} />);

    expect(
      screen.getByRole("option", { name: "70", hidden: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "53", hidden: true }),
    ).toBeInTheDocument();
  });

  it("triggers the callback when typing numbers", async () => {
    const gebeEinkommenAn = vi.fn();
    render(
      <BruttoeinkommenInput {...ANY_PROPS} gebeEinkommenAn={gebeEinkommenAn} />,
    );

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "2");

    expect(gebeEinkommenAn).toHaveBeenCalledOnce();
    expect(gebeEinkommenAn).toHaveBeenLastCalledWith(2);
  });

  it("does not trigger the callback when typing a character or symbol", async () => {
    const gebeEinkommenAn = vi.fn();
    render(
      <BruttoeinkommenInput {...ANY_PROPS} gebeEinkommenAn={gebeEinkommenAn} />,
    );

    const input = screen.getByRole("combobox");
    await userEvent.type(input, "a!}.-");

    expect(gebeEinkommenAn).not.toHaveBeenCalledOnce();
  });
});

const ANY_PROPS = {
  imMutterschutz: false,
  bruttoeinkommen: undefined,
  isMissing: false,
  vorschlaege: [],
  ariaLabel: "",
  gebeEinkommenAn: () => {},
};
