import { RootState } from "../../../redux";
import { render, screen, within } from "../../../test-utils/test-utils";
import EinkommenPage from "../../pages/EinkommenPage";
import {
  initialStepErwerbstaetigkeitState,
  StepErwerbstaetigkeitState,
} from "../../../redux/stepErwerbstaetigkeitSlice";
import userEvent from "@testing-library/user-event";
import { initialStepNachwuchsState } from "../../../redux/stepNachwuchsSlice";
import {
  initialStepEinkommenState,
  StepEinkommenState,
  Taetigkeit,
} from "../../../redux/stepEinkommenSlice";
import { YesNo } from "../../../globals/js/calculations/model";

const testMonths = [
  "Juli 2022",
  "Juni 2022",
  "Mai 2022",
  "April 2022",
  "März 2022",
  "Februar 2022",
  "Januar 2022",
  "Dezember 2021",
  "November 2021",
  "Oktober 2021",
  "September 2021",
  "August 2021",
];

const testDates = [
  "2022-06-01",
  "2022-05-01",
  "2022-04-01",
  "2022-03-01",
  "2022-02-01",
  "2022-01-01",
  "2021-12-01",
  "2021-11-01",
  "2021-10-01",
  "2021-09-01",
  "2021-08-01",
  "2021-07-01",
];

describe("Einkommens Page only with block Selbständige And Erwerbstätige", () => {
  const getElternteil1Section = () => screen.getByLabelText("Elternteil 1");
  const getTaetigkeit1OfElternteil1Section = () =>
    within(getElternteil1Section()).getByLabelText("1. Tätigkeit");

  const stepErwerbstaetigkeitState: StepErwerbstaetigkeitState = {
    ...initialStepErwerbstaetigkeitState,
    ET1: {
      ...initialStepErwerbstaetigkeitState.ET1,
      vorGeburt: YesNo.YES,
      isNichtSelbststaendig: true,
      isSelbststaendig: true,
    },
  };

  const stateFromPreviousSteps: Partial<RootState> = {
    stepNachwuchs: {
      ...initialStepNachwuchsState,
      wahrscheinlichesGeburtsDatum: "08.08.2022",
    },
    stepErwerbstaetigkeit: stepErwerbstaetigkeitState,
  };

  it("should show form block 'Tätigkeiten' if user is 'erwerbstätig' AND is'selbständig'", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const ET1 = getElternteil1Section();

    await userEvent.click(within(ET1).getByText("eine Tätigkeit hinzufügen"));
    await userEvent.click(
      within(ET1).getByText("weitere Tätigkeit hinzufügen"),
    );

    expect(within(ET1).getByText("1. Tätigkeit")).toBeInTheDocument();
    expect(within(ET1).getByText("2. Tätigkeit")).toBeInTheDocument();
  });

  it("should not show form block 'Tätigkeiten' if user is only 'erwerbstätig'", async () => {
    const stateOnlyErwerbstaetig: Partial<RootState> = {
      ...stateFromPreviousSteps,
      stepErwerbstaetigkeit: {
        ...stepErwerbstaetigkeitState,
        ET1: {
          ...stepErwerbstaetigkeitState.ET1,
          isSelbststaendig: false,
        },
      },
    };
    render(<EinkommenPage />, {
      preloadedState: stateOnlyErwerbstaetig,
    });
    const elternteil1Section = getElternteil1Section();

    expect(
      within(elternteil1Section).queryByText("weitere Tätigkeit hinzufügen"),
    ).not.toBeInTheDocument();
  });

  it("should select the kind of the Tätigkeit", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const elternteil1Section = getElternteil1Section();

    await userEvent.click(
      within(elternteil1Section).getByText("eine Tätigkeit hinzufügen"),
    );
    const select = within(elternteil1Section).getByRole("combobox", {
      name: "Art der Tätigkeit",
    });

    expect(
      within(select).getByRole("option", {
        name: "nichtselbständige Arbeit",
      }),
    ).toBeInTheDocument();
    expect(
      within(select).getByRole("option", {
        name: "Gewinneinkünfte",
      }),
    ).toBeInTheDocument();
  });

  it("should remove a Tätigkeit", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const elternteil1Section = getElternteil1Section();

    await userEvent.click(
      within(elternteil1Section).getByText("eine Tätigkeit hinzufügen"),
    );
    await userEvent.click(
      within(elternteil1Section).getByText("Tätigkeit löschen"),
    );

    expect(
      within(elternteil1Section).queryByLabelText("1. Tätigkeit"),
    ).not.toBeInTheDocument();
  });

  it("should show selection of the last 12 months before the expected birth date", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const elternteil1Section = getElternteil1Section();

    await userEvent.click(
      within(elternteil1Section).getByText("eine Tätigkeit hinzufügen"),
    );

    const einkommenElternteil1TaetigkeitenVon =
      within(elternteil1Section).getByLabelText("von");
    const einkommenElternteil1TaetigkeitenBis =
      within(elternteil1Section).getByLabelText("bis");

    for (const month of testMonths) {
      expect(
        within(einkommenElternteil1TaetigkeitenVon).getByRole("option", {
          name: month,
        }),
      ).toBeInTheDocument();
    }
    for (const month of testMonths) {
      expect(
        within(einkommenElternteil1TaetigkeitenBis).getByRole("option", {
          name: month,
        }),
      ).toBeInTheDocument();
    }
  });

  it("should add 'weiteren Zeitraum' when clicked on button in section Zeitraum 1. Tätigkeit", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });

    const elternteil1Section = getElternteil1Section();
    const btnElternteil1 = within(elternteil1Section).getByRole("button", {
      name: "eine Tätigkeit hinzufügen",
    });
    await userEvent.click(btnElternteil1);

    const button = within(elternteil1Section).getByRole("button", {
      name: "weiteren Zeitraum hinzufügen",
    });
    await userEvent.click(button);

    const einkommenElternteil1TaetigkeitenVon =
      within(elternteil1Section).getAllByLabelText("von")[1];
    const einkommenElternteil1TaetigkeitenBis =
      within(elternteil1Section).getAllByLabelText("bis")[1];

    for (const month of testMonths) {
      expect(
        within(einkommenElternteil1TaetigkeitenVon).getByRole("option", {
          name: month,
        }),
      ).toBeInTheDocument();
    }
    for (const month of testMonths) {
      expect(
        within(einkommenElternteil1TaetigkeitenBis).getByRole("option", {
          name: month,
        }),
      ).toBeInTheDocument();
    }
  });

  it("should show 'Minijob' when choose 'Einkünfte aus nichtselbständiger Arbeit'", async () => {
    // given
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const elternteil1Section = getElternteil1Section();

    await userEvent.click(
      within(elternteil1Section).getByText("eine Tätigkeit hinzufügen"),
    );
    const select = within(getTaetigkeit1OfElternteil1Section()).getByRole(
      "combobox",
      {
        name: "Art der Tätigkeit",
      },
    );

    // when
    await userEvent.selectOptions(select, "nichtselbständige Arbeit");

    // then
    expect(
      within(getTaetigkeit1OfElternteil1Section()).getByText(
        /Anstellung ein Minijob, mit einer maximalen Vergütung von 520/,
      ),
    ).toBeInTheDocument();
  });

  it("should hide 'Minijob' when choose 'Gewinneinkünfte'", async () => {
    // given
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });
    const elternteil1Section = getElternteil1Section();

    await userEvent.click(
      within(elternteil1Section).getByText("eine Tätigkeit hinzufügen"),
    );
    const select = within(getTaetigkeit1OfElternteil1Section()).getByRole(
      "combobox",
      {
        name: "Art der Tätigkeit",
      },
    );

    // when
    await userEvent.selectOptions(select, "Gewinneinkünfte");

    // then
    expect(
      within(getTaetigkeit1OfElternteil1Section()).queryByText(
        /Anstellung ein Minijob, mit einer maximalen Vergütung von 520/,
      ),
    ).not.toBeInTheDocument();
  });

  describe("Validation of form", () => {
    const taetigkeit1: Taetigkeit = {
      artTaetigkeit: "NichtSelbststaendig",
      bruttoEinkommenDurchschnitt: 1000,
      isMinijob: YesNo.NO,
      versicherungen: {
        hasArbeitslosenversicherung: true,
        hasKrankenversicherung: true,
        hasRentenversicherung: true,
        none: false,
      },
      zeitraum: [{ from: testDates[3], to: testDates[0] }],
    };

    const stateEinkommenValid: StepEinkommenState = {
      ...initialStepEinkommenState,
      ET1: {
        ...initialStepEinkommenState.ET1,
        taetigkeitenNichtSelbstaendigUndSelbstaendig: [taetigkeit1],
      },
    };
    const validFormState = {
      ...stateFromPreviousSteps,
      stepEinkommen: stateEinkommenValid,
    };

    it("should require the Durchschnittliches Brutto-Einkommen", async () => {
      render(<EinkommenPage />, { preloadedState: validFormState });
      const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

      await userEvent.clear(
        within(taetigkeit1Section).getByLabelText(
          "Durchschnittliches Brutto-Einkommen",
        ),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(
        within(taetigkeit1Section).getByText("Dieses Feld ist erforderlich"),
      ).toBeInTheDocument();
    });

    describe("Zeitraum", () => {
      it("should require the from-Field", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const zeitraum1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("von"),
          "",
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(zeitraum1Section).getByText("Feld 'von' ist erforderlich"),
        ).toBeInTheDocument();
      });

      it("should require the to-Field", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const zeitraum1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("bis"),
          "",
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(zeitraum1Section).getByText("Feld 'bis' ist erforderlich"),
        ).toBeInTheDocument();
      });

      it("should require the from- and to-Field", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });

        const zeitraum1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("von"),
          "",
        );
        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("bis"),
          "",
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(zeitraum1Section).getByText(
            "Feld 'von' und 'bis' sind erforderlich",
          ),
        ).toBeInTheDocument();
      });

      it("should require to-Month to be after from-Month", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });

        const zeitraum1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("von"),
          testDates[0],
        );
        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("bis"),
          testDates[2],
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(zeitraum1Section).getByText(
            "Zeitraum 'bis' muss nach 'von' liegen",
          ),
        ).toBeInTheDocument();
      });
    });

    describe("Versicherungen", () => {
      it("should not show an error if at least one Versicherung was selected", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(taetigkeit1Section).queryByText(
            "Mindestens eine Option muss gewählt werden",
          ),
        ).not.toBeInTheDocument();
      });

      it("should show an error if no Versicherung option was selected", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.click(
          within(taetigkeit1Section).getByLabelText(
            "rentenversicherungspflichtig",
          ),
        );
        await userEvent.click(
          within(taetigkeit1Section).getByLabelText(
            "krankenversicherungspflichtig",
          ),
        );
        await userEvent.click(
          within(taetigkeit1Section).getByLabelText(
            "arbeitslosenversicherungspflichtig",
          ),
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(taetigkeit1Section).getByText(
            "Mindestens eine Option muss gewählt werden",
          ),
        ).toBeInTheDocument();
      });

      it("should deselect all other Versicherungen if choosing none", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.click(
          within(taetigkeit1Section).getByLabelText("keines der Genannten"),
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(taetigkeit1Section).getByLabelText(
            "rentenversicherungspflichtig",
          ),
        ).not.toBeChecked();
        expect(
          within(taetigkeit1Section).getByLabelText(
            "krankenversicherungspflichtig",
          ),
        ).not.toBeChecked();
        expect(
          within(taetigkeit1Section).getByLabelText(
            "arbeitslosenversicherungspflichtig",
          ),
        ).not.toBeChecked();
      });

      it("should deselect none if selecting any other Versicherung", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });
        const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.click(
          within(taetigkeit1Section).getByLabelText("keines der Genannten"),
        );
        await userEvent.click(
          within(taetigkeit1Section).getByLabelText(
            "rentenversicherungspflichtig",
          ),
        );
        await userEvent.click(screen.getByText("Weiter"));

        expect(
          within(taetigkeit1Section).getByLabelText("keines der Genannten"),
        ).not.toBeChecked();
      });
    });
  });
});
