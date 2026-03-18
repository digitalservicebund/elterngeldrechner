import classNames from "classnames";
import { useId } from "react";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { IMaskInput } from "react-imask";
import { Description } from "@/application/features/abfrageteil/components/common";

type Props<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = UseControllerProps<TFieldValues, TName> & {
  readonly label: string;
  readonly className?: string;
  readonly ariaDescribedByIfNoError?: string;
};

export function CurrencyInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  className,
  ariaDescribedByIfNoError,
}: Props<TFieldValues, TName>) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ control, name });

  const errorIdentifier = useId();
  const hasError = error !== undefined;
  const descriptionIdentifier = hasError
    ? errorIdentifier
    : ariaDescribedByIfNoError;

  return (
    <div
      className={classNames(
        "flex flex-col",
        error && "border-danger",
        className,
      )}
    >
      <label className="mb-8" htmlFor={name}>
        {label}
      </label>

      <IMaskInput
        className="max-w-[17rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary"
        inputRef={ref}
        mask="num Euro"
        unmask
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: ".",
            radix: ",",
            mapToRadix: [],
            scale: 2,
          },
        }}
        lazy={false}
        autofix
        value={value === null ? "" : String(value)}
        onAccept={(_, mask) => {
          const rawValue = mask.unmaskedValue;

          if (!rawValue || rawValue === "") {
            onChange(null);
          } else {
            onChange(Number(rawValue));
          }
        }}
        onBlur={onBlur}
        onCopy={(e: React.ClipboardEvent<HTMLInputElement>) => {
          const selection = globalThis.getSelection()?.toString();

          if (selection && value !== null) {
            e.preventDefault();
            const cleanValue = selection.replaceAll(/[^0-9,]/g, "");
            e.clipboardData.setData("text/plain", cleanValue);
          }
        }}
        type="text"
        inputMode="numeric"
        name={name}
        id={name}
        aria-invalid={!!error}
        aria-describedby={descriptionIdentifier}
      />

      {!!error && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </div>
  );
}

if (import.meta.vitest) {
  const { beforeEach, describe, expect, it, vi } = import.meta.vitest;

  describe("Custom Currency Input", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { userEvent } = await import("@testing-library/user-event");
    const { useForm } = await import("react-hook-form");
    const { CurrencyInput } = await import("./CurrencyInput");
    const { Button } = await import("@/application/components");

    const onSubmit = vi.fn();

    function TestComponent() {
      const { handleSubmit, control } = useForm<{ testField: string }>();

      return (
        <form onSubmit={handleSubmit((value) => onSubmit(value))}>
          <CurrencyInput
            control={control}
            name="testField"
            label="Number Field Label"
          />

          <Button className="btn btn-outline-primary" type="submit">
            Submit
          </Button>
        </form>
      );
    }

    beforeEach(() => onSubmit.mockClear());

    it("should allow numbers with a comma", async () => {
      render(<TestComponent />);

      const numberField = screen.getByLabelText("Number Field Label");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await userEvent.type(numberField, "100,2");
      await userEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({ testField: 100.2 });
    });

    it("should submit only number with two decimals", async () => {
      render(<TestComponent />);

      const numberField = screen.getByLabelText("Number Field Label");
      const submitButton = screen.getByRole("button", { name: "Submit" });

      await userEvent.type(numberField, "2,51559abc");
      await userEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledWith({ testField: 2.51 });
    });

    describe("Copy Paste Behaviour", async () => {
      const { fireEvent } = await import("@testing-library/react");

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
        const selectionSpy = vi
          .spyOn(globalThis, "getSelection")
          .mockReturnValue({
            toString: () => selectionMock,
          } as Selection);

        const clipboardData = {
          setData: vi.fn(),
          getData: vi.fn(),
        };

        fireEvent.copy(numberField, {
          clipboardData: clipboardData,
        });

        expect(clipboardData.setData).toHaveBeenCalledWith(
          "text/plain",
          "1234",
        );
        selectionSpy.mockRestore();
      });
    });
  });
}
