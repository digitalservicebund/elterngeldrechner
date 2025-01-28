import { Store, configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NachwuchsPage from "./NachwuchsPage";
import { RootState, reducers } from "@/redux";
import {
  StepNachwuchsState,
  initialStepNachwuchsState,
} from "@/redux/stepNachwuchsSlice";
import { act, render, screen } from "@/test-utils/test-utils";

const currentYear = new Date().getFullYear();

describe("Nachwuchs Page", () => {
  it("should increase and decrease number of expected children", async () => {
    render(<NachwuchsPage />);

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
    render(<NachwuchsPage />);

    const numberField = screen.getByLabelText(
      "Wie viele Kinder werden oder wurden geboren?",
    );

    for (let i = 0; i < 20; i++) {
      await userEvent.click(screen.getByTestId("erhöhen"));
    }
    expect(numberField).toHaveValue(8);
  });

  it("should not decrease below 0 children", async () => {
    render(<NachwuchsPage />);

    const numberField = screen.getByLabelText(
      "Wie viele Kinder werden oder wurden geboren?",
    );

    for (let i = 0; i < 20; i++) {
      await userEvent.click(screen.getByTestId("verringern"));
    }
    expect(numberField).toHaveValue(0);
  });

  it("should display the typed value for the expected birthday", async () => {
    render(<NachwuchsPage />);

    const dateField = screen.getByLabelText(
      "Wann wird oder wurde Ihr Kind voraussichtlich geboren?",
    );

    await userEvent.type(dateField, "a12.12lasd!2022");

    expect(dateField).toHaveValue("12.12.2022");
  });

  it("should add one new Geschwisterkind if clicked on the Geschwisterkind Add Button", async () => {
    render(<NachwuchsPage />);

    const addButton = screen.getByRole("button", {
      name: /älteres geschwisterkind hinzufügen/i,
    });

    await userEvent.click(addButton);

    const dateField = screen.getByLabelText(
      "Wann wird oder wurde Ihr Kind voraussichtlich geboren?",
    );

    expect(dateField).toBeInTheDocument();
  });

  it("should add one new Geschwisterkind if clicked on the Geschwisterkind Add Button and check Behinderung-Checkbox", async () => {
    render(<NachwuchsPage />);

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
    render(<NachwuchsPage />);

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
  let store: Store<RootState>;

  beforeEach(() => {
    store = configureStore({ reducer: reducers });
  });

  it("should persist the step", async () => {
    render(<NachwuchsPage />, { store });
    const expectedState: StepNachwuchsState = {
      ...initialStepNachwuchsState,
      anzahlKuenftigerKinder: 3,
      wahrscheinlichesGeburtsDatum: "12.12." + currentYear,
      geschwisterkinder: [
        {
          geburtsdatum: "01.03.1985",
          istBehindert: true,
        },
      ],
    };

    for (let i = 0; i < 2; i++) {
      await userEvent.click(screen.getByTestId("erhöhen"));
    }

    const dateField = screen.getByLabelText(
      "Wann wird oder wurde Ihr Kind voraussichtlich geboren?",
    );
    await userEvent.type(dateField, "a12.12lasd!" + currentYear);

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

    expect(store.getState().stepNachwuchs).toEqual(expectedState);
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

      const validFormState: StepNachwuchsState = {
        ...initialStepNachwuchsState,
        anzahlKuenftigerKinder: 2,
        wahrscheinlichesGeburtsDatum: "02.01.2020",
        geschwisterkinder: [
          {
            geburtsdatum: "",
            istBehindert: true,
          },
        ],
      };

      render(<NachwuchsPage />, {
        preloadedState: { stepNachwuchs: validFormState },
      });

      await act(() => userEventsForFakeTime.click(screen.getByText("Weiter")));

      expect(
        screen.queryByText(
          "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
        ),
      ).not.toBeInTheDocument();
    });

    it("should not accept expected birth of child that is more than 32 months before current date", async () => {
      vi.setSystemTime(new Date("2023-01-02"));

      const validFormState: StepNachwuchsState = {
        ...initialStepNachwuchsState,
        anzahlKuenftigerKinder: 2,
        wahrscheinlichesGeburtsDatum: "01.01.2020",
        geschwisterkinder: [
          {
            geburtsdatum: "",
            istBehindert: true,
          },
        ],
      };

      render(<NachwuchsPage />, {
        preloadedState: { stepNachwuchs: validFormState },
      });

      await act(() => userEventsForFakeTime.click(screen.getByText("Weiter")));

      expect(
        screen.getByText(
          "Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("should go to the next step but filters empty Geschwisterkinder", async () => {
    const validFormState: StepNachwuchsState = {
      ...initialStepNachwuchsState,
      anzahlKuenftigerKinder: 2,
      wahrscheinlichesGeburtsDatum: "12.12." + currentYear,
      geschwisterkinder: [
        {
          geburtsdatum: "",
          istBehindert: true,
        },
      ],
    };

    store = configureStore({
      reducer: reducers,
      preloadedState: { stepNachwuchs: validFormState },
    });

    render(<NachwuchsPage />, { store });
    await userEvent.click(screen.getByText("Weiter"));

    expect(store.getState().stepNachwuchs.geschwisterkinder).toHaveLength(0);
  });

  it("should show validation error if birthdate of Geschwisterkinder is not filled completely", async () => {
    const invalidFormState: StepNachwuchsState = {
      ...initialStepNachwuchsState,
      anzahlKuenftigerKinder: 2,
      wahrscheinlichesGeburtsDatum: "12.12.2022",
      geschwisterkinder: [
        {
          geburtsdatum: "12.05.20",
          istBehindert: false,
        },
      ],
    };

    store = configureStore({
      reducer: reducers,
      preloadedState: { stepNachwuchs: invalidFormState },
    });

    render(<NachwuchsPage />, { store });
    await userEvent.click(screen.getByText("Weiter"));

    const errorMessage = screen.getByText(
      "Bitte das Feld vollständig ausfüllen",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should show validation error if birthdate of Geschwisterkinder is after birthdate of Kind", async () => {
    const invalidFormState: StepNachwuchsState = {
      ...initialStepNachwuchsState,
      anzahlKuenftigerKinder: 2,
      wahrscheinlichesGeburtsDatum: "12.12.2022",
      geschwisterkinder: [
        {
          geburtsdatum: "13.12.2022",
          istBehindert: false,
        },
      ],
    };

    store = configureStore({
      reducer: reducers,
      preloadedState: { stepNachwuchs: invalidFormState },
    });

    render(<NachwuchsPage />, { store });
    await userEvent.click(screen.getByText("Weiter"));

    const errorMessage = screen.getByText(
      "Wählen Sie ein anderes Datum. Geschwister müssen älter sein als das neue Kind.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should show a validation error if some information is missing", async () => {
    const invalidFormState: StepNachwuchsState = {
      ...initialStepNachwuchsState,
      anzahlKuenftigerKinder: 1,
      wahrscheinlichesGeburtsDatum: "",
      geschwisterkinder: [
        {
          geburtsdatum: "01.03.1985",
          istBehindert: true,
        },
      ],
    };
    render(<NachwuchsPage />, {
      preloadedState: { stepNachwuchs: invalidFormState },
    });

    await userEvent.click(screen.getByText("Weiter"));

    expect(
      screen.getByText("Dieses Feld ist erforderlich"),
    ).toBeInTheDocument();
  });
});
