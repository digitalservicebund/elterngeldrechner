import { render, screen, within } from "@testing-library/react";
import { ListeMitZeitraeumen } from "./ListeMitZeitraeumen";

describe("Liste mit Zeiträumen", () => {
  it("shows a list", () => {
    render(
      <ListeMitZeitraeumen {...ANY_PROPS} pseudonymDesElternteils="Jane" />,
    );

    expect(
      screen.getByRole("list", {
        name: "Zeiträume mit Elterngeldbezug von Jane",
      }),
    ).toBeVisible();
  });

  it("has a list entry for each Zeitraum", () => {
    const zeitraeume = [
      { from: new Date(2013, 3, 7), to: new Date(2013, 7, 6) },
      { from: new Date(2013, 10, 7), to: new Date(2014, 1, 6) },
    ];

    render(<ListeMitZeitraeumen {...ANY_PROPS} zeitraeume={zeitraeume} />);

    const listItems = screen.queryAllByRole("listitem");

    expect(listItems.length).toBe(2);
    expect(within(listItems[0]).queryByText("07.04. bis 06.08.2013"));
    expect(within(listItems[0]).queryByText("07.11. bis 06.02.2014"));
  });
});

const ANY_PROPS = {
  zeitraeume: [],
  pseudonymDesElternteils: "Jane",
};
