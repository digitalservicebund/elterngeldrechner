import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Haushaltseinkommen } from "./Haushaltseinkommen";

describe("Elterngeldbezugsanzeige", () => {
  it("shows the formatted Elterngeldbzeug with currency", () => {
    render(<Haushaltseinkommen {...ANY_PROPS} elterngeldbezug={10} />);

    expect(screen.queryByText("10 €")).toBeVisible();
  });

  it("shows the formatted Bruttoeinkommen with currency", () => {
    render(<Haushaltseinkommen {...ANY_PROPS} bruttoeinkommen={20} />);

    expect(screen.queryByText("20 €")).toBeVisible();
  });

  it("shows a warning icon when Bruttoeinkommen is missing", () => {
    render(<Haushaltseinkommen bruttoeinkommenIsMissing />);

    expect(screen.getByTestId("ErrorIcon")).toBeVisible();
  });

  it("shows an information if being im Mutterschutz", () => {
    render(<Haushaltseinkommen {...ANY_PROPS} imMutterschutz />);

    expect(screen.queryByText("Mutterschutz")).toBeVisible();
  });
});

const ANY_PROPS = {
  bruttoeinkommenIsMissing: false,
};
