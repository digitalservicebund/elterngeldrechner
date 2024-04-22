import { render, screen } from "@testing-library/react";
import { ElterngeldvariantenDescriptions } from "./ElterngeldvariantenDescriptions";
import userEvent from "@testing-library/user-event";

describe("ElterngeldvariantenDescription", () => {
  it("should display an entry to each Elterngeldvariante", () => {
    render(<ElterngeldvariantenDescriptions />);

    expect(
      screen.queryByText(/Basiselterngeld - 100% Elterngeld/),
    ).toBeVisible();
    expect(screen.queryByText(/ElterngeldPlus - 50% Elterngeld/)).toBeVisible();
    expect(screen.queryByText(/\+ Partnerschaftsbonus/)).toBeVisible();
  });

  it("shows details of Basiselterngeld when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/Basiselterngeld - 100% Elterngeld/);

    await userEvent.click(summary);

    const details = screen.getByText(
      /Mit dem Basiselterngeld können Sie insgesamt bis zu 12 Monate Elternzeit nehmen/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of ElterngeldPlus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/ElterngeldPlus - 50% Elterngeld/);

    await userEvent.click(summary);

    const details = screen.getByText(/Halb so hoch wie Basiselterngel/);
    expect(details).toBeVisible();
  });

  it("shows details of + Partnerschaftsbonus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByText(/\+ Partnerschaftsbonus/);

    await userEvent.click(summary);

    const details = screen.getByText(
      /Die Eltern nutzen den Partnerschaftsbonus gleichzeitig/,
    );
    expect(details).toBeVisible();
  });
});
