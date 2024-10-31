import { render, screen } from "@testing-library/react";
import { Haushaltseinkommen } from "./Haushaltseinkommen";

describe("Elterngeldbezugsanzeige", () => {
  it("shows the formatted Elterngeldbzeug with currency", () => {
    render(<Haushaltseinkommen elterngeldbezug={10} />);

    expect(screen.queryByText("10 €")).toBeVisible();
  });

  it("shows the formatted Bruttoeinkommen with currency", () => {
    render(<Haushaltseinkommen bruttoeinkommen={20} />);

    expect(screen.queryByText("20 €")).toBeVisible();
  });

  it("shows an information if being im Mutterschutz", () => {
    render(<Haushaltseinkommen imMutterschutz />);

    expect(
      screen.queryByRole("button", {
        name: "Öffne Informationen zum Elterngeldbezug im Mutterschutz",
      }),
    ).toBeVisible();
  });
});
