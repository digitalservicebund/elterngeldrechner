import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("should create an alert with text", () => {
    const { container } = render(
      <Alert headline="Überschrift">
        <p>Hinweis</p>
      </Alert>,
    );

    const alertText = screen.getByText("Hinweis", { selector: "p" });
    expect(alertText).toBeInTheDocument();

    const alertHeadline = screen.getByText("Überschrift", { selector: "h3" });
    expect(alertHeadline).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-node-access
    const component = container.firstChild;
    expect(component).toHaveClass("egr-alert");
    expect(component).not.toHaveClass("egr-alert--box");
  });

  it("should create an alert with a box", () => {
    const { container } = render(
      <Alert box headline="Überschrift">
        <p>Hinweis</p>
      </Alert>,
    );

    // eslint-disable-next-line testing-library/no-node-access
    const component = container.firstChild;
    expect(component).toHaveClass("egr-alert", "egr-alert--box");
  });
});
