import { render, screen } from "@testing-library/react";
import { Elterngeldbezugsanzeige } from "./Elterngeldbezugsanzeige";

describe("Elterngeldbezugsanzeige", () => {
  it("shows the formatted Elterngeldbzeug with currency", () => {
    render(<Elterngeldbezugsanzeige elterngeldbezug={10} />);

    expect(screen.queryByText("10 €")).toBeVisible();
  });

  it("shows an information if being im Mutterschutz", () => {
    render(<Elterngeldbezugsanzeige imMutterschutz />);

    expect(
      screen.queryByRole("button", {
        name: "Öffne Informationen zum Elterngeldbezug im Mutterschutz",
      }),
    ).toBeVisible();
  });
});
