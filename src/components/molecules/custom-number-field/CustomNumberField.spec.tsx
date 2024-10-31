import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { CustomNumberField } from "./CustomNumberField";
import { Button } from "@/components/atoms";

interface TestFormValues {
  testField: string;
}

interface Props {
  readonly allowedDecimalPlaces?: 1;
  readonly max?: number;
}

describe("Custom Number Field", () => {
  const onSubmit = vi.fn();

  function TestComponent({ allowedDecimalPlaces, max }: Props) {
    const { handleSubmit, control } = useForm<TestFormValues>();

    return (
      <form onSubmit={handleSubmit((value) => onSubmit(value))}>
        <CustomNumberField
          control={control}
          name="testField"
          label="Number Field Label"
          allowedDecimalPlaces={allowedDecimalPlaces}
          max={max}
        />
        <Button
          className="btn btn-outline-primary"
          label="Submit"
          isSubmitButton
        />
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
});
