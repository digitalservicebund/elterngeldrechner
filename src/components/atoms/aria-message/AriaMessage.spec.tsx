import { render, screen, within } from "@testing-library/react";
import { AriaMessage } from "./AriaMessage";
import { AriaLogProvider } from "./AriaLogProvider";

describe("Aria Message", () => {
  it("should put every message into the log to let the screen reader read the messages", () => {
    const message1 = "Message 1";
    const message2 = "Message 2";
    render(
      <AriaLogProvider>
        <AriaMessage>{message1}</AriaMessage>
        <AriaMessage>{message2}</AriaMessage>
      </AriaLogProvider>,
    );

    const logElement = screen.getByRole("log");

    expect(within(logElement).getByText(message1)).toBeInTheDocument();
    expect(within(logElement).getByText(message2)).toBeInTheDocument();
  });
});
