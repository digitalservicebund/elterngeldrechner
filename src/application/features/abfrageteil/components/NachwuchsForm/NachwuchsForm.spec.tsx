import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NachwuchsForm } from "./NachwuchsForm";
import { INITIAL_STATE, act, render, screen } from "@/application/test-utils";

const currentYear = new Date().getFullYear();

describe("Nachwuchs Page", () => {
  it("should increase and decrease number of expected children", async () => {
    render(<NachwuchsForm />);

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
    render(<NachwuchsForm />);

    const numberField = screen.getByLabelText(
      "Wie viele Kinder werden oder wurden geboren?",
    );

    for (let i = 0; i < 20; i++) {
      await userEvent.click(screen.getByTestId("erhöhen"));
    }
    expect(numberField).toHaveValue(8);
  });

  it("should not decrease below 0 children", async () => {
    render(<NachwuchsForm />);

    const numberField = screen.getByLabelText(
      "Wie viele Kinder werden oder wurden geboren?",
    );

    for (let i = 0; i < 20; i++) {
      await userEvent.click(screen.getByTestId("verringern"));
    }
    expect(numberField).toHaveValue(0);
  });

  it("should display the typed value for the expected birthday", async () => {
    render(<NachwuchsForm />);

    const dateField = screen.getByRole("textbox", {
      name: "Geburtsdatum des Kindes",
    });

    await userEvent.type(dateField, "a12.12lasd!2022");

    expect(dateField).toHaveValue("12.12.2022");
  });

  it("should add one new Geschwisterkind if clicked on the Geschwisterkind Add Button", async () => {
    render(<NachwuchsForm />);

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
    render(<NachwuchsForm />);

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
    render(<NachwuchsForm />);

    const addButton = screen.getByRole("button", {
      name: /älteres geschwisterkind hinzufügen/i,
    });

    await userEvent.click(addButton);

    expect(addButton).toHaveAccessibleName(
      /weiteres geschwisterkind hinzufügen/i,
    );
  });
});

describe("Submitting the form", () => {
  it("should persist the step", async () => {
    const { store } = render(<NachwuchsForm />);

    for (let i = 0; i < 2; i++) {
      await userEvent.click(screen.getByTestId("erhöhen"));
    }

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Geburtsdatum des Kindes",
      }),
      "a12.12lasd!" + currentYear,
    );

    const addButton = screen.getByRole("button", {
      name: /älteres geschwisterkind hinzufügen/i,
    });
    await userEvent.click(addButton);

    const dateFieldGeschwister = screen.getByLabelText(
      "Wann wurde das Geschwisterkind geboren?",
    );
    await userEvent.type(dateFieldGeschwister, "01031985");

    const checkbox = screen.getByLabelText(
      "Das Geschwisterkind hat eine Behinderung",
    );
    await userEvent.click(checkbox);

    await userEvent.click(screen.getByText("Weiter"));

    expect(store.getState().stepNachwuchs).toMatchObject({
      anzahlKuenftigerKinder: 3,
      wahrscheinlichesGeburtsDatum: "12.12." + currentYear,
      geschwisterkinder: [
        {
          geburtsdatum: "01.03.1985",
          istBehindert: true,
        },
      ],
    });
  });

  describe("warning for too old birthdate", () => {
    const userEventsForFakeTime = userEvent.setup({ delay: null });

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

      const validFormState = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.anzahlKuenftigerKinder = 2;
        draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "02.01.2020";
        draft.stepNachwuchs.geschwisterkinder = [
          {
            geburtsdatum: "",
            istBehindert: true,
          },
        ];
      });

      render(<NachwuchsForm />, { preloadedState: validFormState });

      await act(() => userEventsForFakeTime.click(screen.getByText("Weiter")));

      expect(
        screen.queryByText(
          "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
        ),
      ).not.toBeInTheDocument();
    });

    it("should not accept expected birth of child that is more than 32 months before current date", async () => {
      vi.setSystemTime(new Date("2023-01-02"));

      const validFormState = produce(INITIAL_STATE, (draft) => {
        draft.stepNachwuchs.anzahlKuenftigerKinder = 2;
        draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "01.01.2020";
        draft.stepNachwuchs.geschwisterkinder = [
          {
            geburtsdatum: "",
            istBehindert: true,
          },
        ];
      });

      render(<NachwuchsForm />, { preloadedState: validFormState });

      await act(() => userEventsForFakeTime.click(screen.getByText("Weiter")));

      expect(
        screen.getByText(
          "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("should show validation error if birthdate of Geschwisterkinder is not filled completely", async () => {
    const invalidFormState = produce(INITIAL_STATE, (draft) => {
      draft.stepNachwuchs.anzahlKuenftigerKinder = 2;
      draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "12.12.2022";
      draft.stepNachwuchs.geschwisterkinder = [
        {
          geburtsdatum: "12.05.20",
          istBehindert: false,
        },
      ];
    });

    render(<NachwuchsForm />, { preloadedState: invalidFormState });

    await userEvent.click(screen.getByText("Weiter"));

    const errorMessage = screen.getByText(
      "Bitte das Feld vollständig ausfüllen",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should show validation error if birthdate of Geschwisterkinder is after birthdate of Kind", async () => {
    const invalidFormState = produce(INITIAL_STATE, (draft) => {
      draft.stepNachwuchs.anzahlKuenftigerKinder = 2;
      draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "12.12.2022";
      draft.stepNachwuchs.geschwisterkinder = [
        {
          geburtsdatum: "13.12.2022",
          istBehindert: false,
        },
      ];
    });

    render(<NachwuchsForm />, { preloadedState: invalidFormState });
    await userEvent.click(screen.getByText("Weiter"));

    const errorMessage = screen.getByText(
      "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should show a validation error if some information is missing", async () => {
    const invalidFormState = produce(INITIAL_STATE, (draft) => {
      draft.stepNachwuchs.anzahlKuenftigerKinder = 1;
      draft.stepNachwuchs.wahrscheinlichesGeburtsDatum = "";
      draft.stepNachwuchs.geschwisterkinder = [
        {
          geburtsdatum: "01.03.1985",
          istBehindert: true,
        },
      ];
    });

    render(<NachwuchsForm />, { preloadedState: invalidFormState });

    await userEvent.click(screen.getByText("Weiter"));

    expect(
      screen.getByText("Dieses Feld ist erforderlich"),
    ).toBeInTheDocument();
  });
});
