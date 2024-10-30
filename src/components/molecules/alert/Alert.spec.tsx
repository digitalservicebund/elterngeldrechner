import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("should create an alert with text", () => {
    render(
      <div data-testid="wrapper">
        <Alert headline="Überschrift">
          <p>Hinweis</p>
        </Alert>
      </div>,
    );

    const alertText = screen.getByText("Hinweis", { selector: "p" });
    expect(alertText).toBeInTheDocument();

    const alertHeadline = screen.getByText("Überschrift", {
      selector: "strong",
    });
    expect(alertHeadline).toBeInTheDocument();
  });
});
