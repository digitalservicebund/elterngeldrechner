import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomNumberField } from "./CustomNumberField";
import { Button } from "@/application/components";

type Props = {
  readonly allowedDecimalPlaces?: 1;
  readonly max?: number;
};

describe("Custom Number Field", () => {
  const onSubmit = vi.fn();

  function TestComponent({ allowedDecimalPlaces, max }: Props) {
    const { handleSubmit, control } = useForm<{ testField: string }>();

    return (
      <form onSubmit={handleSubmit((value) => onSubmit(value))}>
        <CustomNumberField
          control={control}
          name="testField"
          label="Number Field Label"
          allowedDecimalPlaces={allowedDecimalPlaces}
          max={max}
        />

        <Button className="btn btn-outline-primary" type="submit">
          Submit
        </Button>
      </form>
    );
  }

  beforeEach(() => {
    onSubmit.mockClear();
  });

  it("should not allow an empty field", async () => {
    render(<TestComponent />);
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    const error = screen.getByText("Dieses Feld ist erforderlich");
    expect(error).toBeInTheDocument();
  });

  it("should allow numbers with a comma", async () => {
    render(<TestComponent />);
    const numberField = screen.getByLabelText("Number Field Label");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(numberField, "100,2");
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ testField: 100.2 });
  });

  it("should submit only allow max number in input field", async () => {
    render(<TestComponent allowedDecimalPlaces={1} max={10} />);
    const numberField = screen.getByLabelText("Number Field Label");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(numberField, "100,2");
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ testField: 10 });
  });

  it("should submit only number with one decimal", async () => {
    render(<TestComponent allowedDecimalPlaces={1} max={10} />);
    const numberField = screen.getByLabelText("Number Field Label");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(numberField, "2,50559abc");
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ testField: 2.5 });
  });

  it("should handle pasted values with thousands separators correctly", async () => {
    render(<TestComponent />);
    const numberField = screen.getByLabelText("Number Field Label");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.click(numberField);
    await userEvent.paste("2.500");
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({ testField: 2500 });
  });

  it("should clean the value from thousands separators and suffix when copied", async () => {
    render(<TestComponent />);
    const numberField = screen.getByLabelText("Number Field Label");

    if (!(numberField instanceof HTMLInputElement)) {
      throw new TypeError("Element is not an input");
    }

    await userEvent.type(numberField, "1234");
    await userEvent.click(numberField);
    numberField.select();

    const selectionMock = numberField.value;
    const selectionSpy = vi.spyOn(globalThis, "getSelection").mockReturnValue({
      toString: () => selectionMock,
    } as Selection);

    const clipboardData = {
      setData: vi.fn(),
      getData: vi.fn(),
    };

    fireEvent.copy(numberField, {
      clipboardData: clipboardData,
    });

    expect(clipboardData.setData).toHaveBeenCalledWith("text/plain", "1234");
    selectionSpy.mockRestore();
  });
});
