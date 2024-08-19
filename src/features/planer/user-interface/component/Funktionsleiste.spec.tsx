import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Funktionsleiste } from "./Funktionsleiste";

describe("Funktionsleiste", () => {
  it("calls the correct calllback when clicking Planung wiederholen", async () => {
    const planungWiederholen = vi.fn();
    render(<Funktionsleiste planungWiederholen={planungWiederholen} />);

    const button = screen.getByRole("button", { name: "Planung wiederholen" });
    await userEvent.click(button);

    expect(planungWiederholen).toHaveBeenCalledOnce();
  });
});
