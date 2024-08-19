import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Funktionsleiste } from "./Funktionsleiste";

describe("Funktionsleiste", () => {
  it("calls the correct callback when clicking Planung wiederholen", async () => {
    const planungWiederholen = vi.fn();
    render(
      <Funktionsleiste
        {...ANY_PROPS}
        planungWiederholen={planungWiederholen}
      />,
    );

    const button = screen.getByRole("button", { name: "Planung wiederholen" });
    await userEvent.click(button);

    expect(planungWiederholen).toHaveBeenCalledOnce();
  });

  it("calls the correct callback when clicking Download der Planung", async () => {
    const downloadePlan = vi.fn();
    render(<Funktionsleiste {...ANY_PROPS} downloadePlan={downloadePlan} />);

    const button = screen.getByRole("button", { name: "Download der Planung" });
    await userEvent.click(button);

    expect(downloadePlan).toHaveBeenCalledOnce();
  });
});

const ANY_PROPS = {
  planungWiederholen: () => {},
  downloadePlan: () => {},
};
