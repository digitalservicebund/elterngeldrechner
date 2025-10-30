import AddIcon from "@digitalservicebund/icons/Add";
import ClearIcon from "@digitalservicebund/icons/Clear";
import { useId } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Counter } from "./Counter";
import { CustomDate } from "./CustomDate";
import { InfoZuFruehgeburten } from "./InfoZuFruehgeburten";
import { InfoZumGeschwisterbonus } from "./InfoZumGeschwisterbonus";
import { Button } from "@/application/components";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import { type StepNachwuchsState } from "@/application/features/abfrageteil/state";

const validateMonth = (date: string) => {
  const [inputDay, inputMonth, inputYear] = date.split(".");
  const year = Number.parseInt(inputYear ?? "0");
  const inputDate = new Date(`${year}-${inputMonth}-${inputDay}`);
  const now = new Date(Date.now());
  const dateMaxMonthAgo = new Date(
    now.setUTCFullYear(now.getUTCFullYear() - 3),
  );

  if (inputDate >= dateMaxMonthAgo) {
    return true;
  } else {
    return `Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.`;
  }
};

type Props = {
  readonly id?: string;
  readonly defaultValues?: StepNachwuchsState;
  readonly onSubmit?: (data: StepNachwuchsState) => void;
};

export function NachwuchsForm({ id, defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues,
  });

  const submitNachwuchs = (values: StepNachwuchsState) => {
    onSubmit?.(values);
  };

  const wahrscheinlichesGeburtsDatumInputIdentifier = useId();
  const wahrscheinlichesGeburtsDatumDescriptionIdentifier = useId();

  const { fields, append, remove } = useFieldArray({
    name: "geschwisterkinder",
    control,
  });

  // Registration as a number is necessary because the addition "numberFutureChildren + 1" is added like a string and results in "21"
  register("anzahlKuenftigerKinder", { valueAsNumber: true });
  const anzahlKuenftigerKinder = watch("anzahlKuenftigerKinder");

  const handleDecrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.max(anzahlKuenftigerKinder - 1, 0),
      { shouldDirty: true },
    );
  const handleIncrease = () =>
    setValue(
      "anzahlKuenftigerKinder",
      Math.min(anzahlKuenftigerKinder + 1, 8),
      { shouldDirty: true },
    );

  const handleAppendGeschwisterkind = () =>
    append({
      geburtsdatum: "",
      istBehindert: false,
    });

  const dateOf = (germanDate: string): Date => {
    const [day, month, year] = germanDate.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const geburtValidation = (date: string) => {
    if (date === "") {
      return true;
    }

    const geburtGeschwisterKind = dateOf(date);
    const wahrscheinlichesGeburtsDatum = getValues(
      "wahrscheinlichesGeburtsDatum",
    );
    const geburtKind = dateOf(wahrscheinlichesGeburtsDatum);

    if (geburtGeschwisterKind < geburtKind) {
      return true;
    } else {
      return "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.";
    }
  };

  const geschwisterHeadingIdentifier = useId();

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div>
        <span id={wahrscheinlichesGeburtsDatumDescriptionIdentifier}>
          Wann ist der Geburtstermin oder das Geburtsdatum von Ihrem Kind?
        </span>

        <InfoZuFruehgeburten />

        <label
          className="mt-20 block text-16"
          htmlFor={wahrscheinlichesGeburtsDatumInputIdentifier}
        >
          Geburtsdatum des Kindes
        </label>

        <CustomDate
          id={wahrscheinlichesGeburtsDatumInputIdentifier}
          error={errors.wahrscheinlichesGeburtsDatum?.message}
          aria-describedby={wahrscheinlichesGeburtsDatumDescriptionIdentifier}
          {...register("wahrscheinlichesGeburtsDatum", {
            required: "Dieses Feld ist erforderlich",
            pattern: {
              value: /^\d{2}\.\d{2}\.\d{4}$/,
              message: "Bitte das Feld vollständig ausfüllen",
            },
            validate: validateMonth,
          })}
        />
      </div>

      <Counter
        register={register}
        registerOptions={{
          max: {
            value: 8,
            message: "Es können nicht mehr als 8 Kinder angegeben werden",
          },
          min: {
            value: 1,
            message: "Es muss mindestens ein Kind angegeben werden",
          },
          required: "Dieses Feld ist erforderlich",
        }}
        name="anzahlKuenftigerKinder"
        label="Wie viele Kinder werden oder wurden geboren?"
        errors={errors}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        required
      />

      <section
        aria-describedby={geschwisterHeadingIdentifier}
        className="pt-32"
      >
        <h3 id={geschwisterHeadingIdentifier} className="mb-10">
          Gibt es ältere Geschwister?
        </h3>

        <p className="flex justify-between">
          Wenn Sie weitere Kinder haben, die ebenfalls in Ihrem Haushalt leben,
          können Sie vielleicht einen Zuschlag zum Elterngeld bekommen, den
          Geschwisterbonus.
        </p>

        <InfoZumGeschwisterbonus />

        <ul className="m-0 mt-16 list-none p-0">
          {fields.map((field, index) => {
            const headingIdentifier = `${field.id}-heading`;
            const geburtsdatumInputIdentifier = `${field.id}-geburtsdatum`;

            return (
              <li
                key={field.id}
                aria-labelledby={headingIdentifier}
                className="mb-32"
              >
                <h4 id={headingIdentifier} className="mb-10 font-regular">
                  {index + 1}. Geschwisterkind
                </h4>

                <label htmlFor={geburtsdatumInputIdentifier}>
                  Wann wurde das Geschwisterkind geboren?
                </label>

                <CustomDate
                  id={geburtsdatumInputIdentifier}
                  className="mt-16"
                  error={
                    errors.geschwisterkinder?.[index]?.geburtsdatum?.message
                  }
                  {...register(`geschwisterkinder.${index}.geburtsdatum`, {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                    validate: geburtValidation,
                  })}
                />

                <CustomCheckbox
                  register={register}
                  name={`geschwisterkinder.${index}.istBehindert`}
                  label="Das Geschwisterkind hat eine Behinderung"
                />

                <Button
                  className="mt-16"
                  type="button"
                  onClick={() => remove(index)}
                  buttonStyle="link"
                >
                  Geschwisterkind entfernen <ClearIcon />
                </Button>
              </li>
            );
          })}
        </ul>

        <Button
          type="button"
          buttonStyle="secondary"
          onClick={handleAppendGeschwisterkind}
        >
          <AddIcon /> {fields.length === 0 ? "Älteres" : "Weiteres"}{" "}
          Geschwisterkind hinzufügen
        </Button>
      </section>
    </form>
  );
}
if (import.meta.vitest) {
  const { afterEach, beforeEach, describe, expect, it, vi } = import.meta
    .vitest;

  describe("Nachwuchs Form", async () => {
    const { render, screen } = await import("@/application/test-utils");
    const { userEvent } = await import("@testing-library/user-event");

    const initialState: StepNachwuchsState = {
      anzahlKuenftigerKinder: 1,
      wahrscheinlichesGeburtsDatum: "",
      geschwisterkinder: [],
    };

    it("should increase and decrease number of expected children", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const numberField = screen.getByLabelText(
        "Wie viele Kinder werden oder wurden geboren?",
      );

      expect(numberField).toHaveValue(1);

      await userEvent.click(screen.getByTestId("erhöhen"));
      expect(numberField).toHaveValue(2);

      await userEvent.click(screen.getByTestId("verringern"));
      expect(numberField).toHaveValue(1);
    });

    it("should not increase beyond 8 expected children", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const numberField = screen.getByLabelText(
        "Wie viele Kinder werden oder wurden geboren?",
      );

      for (let i = 0; i < 20; i++) {
        await userEvent.click(screen.getByTestId("erhöhen"));
      }
      expect(numberField).toHaveValue(8);
    });

    it("should not decrease below 0 children", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const numberField = screen.getByLabelText(
        "Wie viele Kinder werden oder wurden geboren?",
      );

      for (let i = 0; i < 20; i++) {
        await userEvent.click(screen.getByTestId("verringern"));
      }
      expect(numberField).toHaveValue(0);
    });

    it("should display the typed value for the expected birthday", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const dateField = screen.getByRole("textbox", {
        name: "Geburtsdatum des Kindes",
      });

      await userEvent.type(dateField, "a12.12lasd!2022");

      expect(dateField).toHaveValue("12.12.2022");
    });

    it("should add one new Geschwisterkind if clicked on the Geschwisterkind Add Button", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const addButton = screen.getByRole("button", {
        name: /älteres geschwisterkind hinzufügen/i,
      });

      await userEvent.click(addButton);

      expect(
        screen.getByRole("textbox", {
          name: "Wann wurde das Geschwisterkind geboren?",
        }),
      ).toBeVisible();
    });

    it("should add one new Geschwisterkind if clicked on the Geschwisterkind Add Button and check Behinderung-Checkbox", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const addButton = screen.getByRole("button", {
        name: /älteres geschwisterkind hinzufügen/i,
      });

      await userEvent.click(addButton);

      const checkbox = screen.getByLabelText(
        "Das Geschwisterkind hat eine Behinderung",
      );

      expect(checkbox).not.toBeChecked();

      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("should change the title of the add new Geschwisterkind button after the first added child", async () => {
      render(<NachwuchsForm defaultValues={initialState} />);

      const addButton = screen.getByRole("button", {
        name: /älteres geschwisterkind hinzufügen/i,
      });

      await userEvent.click(addButton);

      expect(addButton).toHaveAccessibleName(
        /weiteres geschwisterkind hinzufügen/i,
      );
    });
  });

  describe("Nachwuchs Form Validation", async () => {
    const { NachwuchsForm } = await import("./NachwuchsForm");
    const { fireEvent, renderForm, screen, waitFor } = await import(
      "@/application/test-utils"
    );

    describe("warning for too old birthdate", () => {
      beforeEach(() => {
        vi.stubGlobal("jest", {
          advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
        });
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it("should accept expected birth of child that is 32 months before current date", async () => {
        vi.setSystemTime(new Date("2023-01-02"));

        const validFormState: StepNachwuchsState = {
          anzahlKuenftigerKinder: 2,
          wahrscheinlichesGeburtsDatum: "02.01.2020",
          geschwisterkinder: [
            {
              geburtsdatum: "",
              istBehindert: true,
            },
          ],
        };

        const form = renderForm(NachwuchsForm, {
          initialState: validFormState,
        });

        fireEvent.submit(form);

        await waitFor(() => {
          expect(
            screen.queryByText(
              "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
            ),
          ).not.toBeInTheDocument();
        });
      });

      it("should not accept expected birth of child that is more than 32 months before current date", async () => {
        vi.setSystemTime(new Date("2023-01-02"));

        const validFormState: StepNachwuchsState = {
          anzahlKuenftigerKinder: 2,
          wahrscheinlichesGeburtsDatum: "01.01.2020",
          geschwisterkinder: [
            {
              geburtsdatum: "",
              istBehindert: true,
            },
          ],
        };

        const form = renderForm(NachwuchsForm, {
          initialState: validFormState,
        });

        fireEvent.submit(form);

        await waitFor(() => {
          expect(
            screen.getByText(
              "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
            ),
          ).toBeInTheDocument();
        });
      });
    });

    it("should show validation error if birthdate of Geschwisterkinder is not filled completely", async () => {
      const invalidFormState: StepNachwuchsState = {
        anzahlKuenftigerKinder: 2,
        wahrscheinlichesGeburtsDatum: "12.12.2022",
        geschwisterkinder: [
          {
            geburtsdatum: "12.05.20",
            istBehindert: false,
          },
        ],
      };

      const form = renderForm(NachwuchsForm, {
        initialState: invalidFormState,
      });

      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Bitte das Feld vollständig ausfüllen"),
        ).toBeInTheDocument();
      });
    });

    it("should show validation error if birthdate of Geschwisterkinder is after birthdate of Kind", async () => {
      const invalidFormState: StepNachwuchsState = {
        anzahlKuenftigerKinder: 2,
        wahrscheinlichesGeburtsDatum: "12.12.2022",
        geschwisterkinder: [
          {
            geburtsdatum: "13.12.2022",
            istBehindert: false,
          },
        ],
      };

      const form = renderForm(NachwuchsForm, {
        initialState: invalidFormState,
      });

      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should show a validation error if some information is missing", async () => {
      const invalidFormState: StepNachwuchsState = {
        anzahlKuenftigerKinder: 1,
        wahrscheinlichesGeburtsDatum: "",
        geschwisterkinder: [
          {
            geburtsdatum: "01.03.1985",
            istBehindert: true,
          },
        ],
      };

      const form = renderForm(NachwuchsForm, {
        initialState: invalidFormState,
      });

      fireEvent.submit(form);

      await waitFor(() => {
        expect(
          screen.getByText("Dieses Feld ist erforderlich"),
        ).toBeInTheDocument();
      });
    });
  });
}
