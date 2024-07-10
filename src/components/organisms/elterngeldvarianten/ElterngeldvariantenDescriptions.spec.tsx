import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ElterngeldvariantenDescriptions } from "./ElterngeldvariantenDescriptions";
import { render } from "@/test-utils/test-utils";

/*
 * Notice that the current implicit ARIA roles and attributes for the
 * `<details>` HTML element are not well supported. Thereby it is a little hard
 * to write proper role based queries.
 */
describe("ElterngeldvariantenDescription", () => {
  it("shows details of Basiselterngeld when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "Was ist Basiselterngeld?",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Als Basiselterngeld bekommen Sie normalerweise 65 Prozent des Nettoeinkommens,/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of ElterngeldPlus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "Was ist ElterngeldPlus?",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Statt eines Lebensmonats Basiselterngeld können Sie 2 Lebensmonate ElterngeldPlus bekommen/,
    );
    expect(details).toBeVisible();
  });

  it("shows details of Partnerschaftsbonus when clicking on its summary", async () => {
    render(<ElterngeldvariantenDescriptions />);
    const summary = screen.getByRole("heading", {
      name: "Was ist Partnerschaftsbonus?",
    });

    await userEvent.click(summary);

    const details = screen.getByText(
      /Für den Partnerschaftsbonus muss man 24 bis 32 Stunden pro Woche in Teilzeit arbeiten/,
    );
    expect(details).toBeVisible();
  });
});
