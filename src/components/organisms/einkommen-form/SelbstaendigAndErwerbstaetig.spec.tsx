import userEvent from "@testing-library/user-event";
import EinkommenPage from "@/components/pages/EinkommenPage";
import { YesNo } from "@/globals/js/calculations/model";
import { RootState } from "@/redux";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import {
  StepEinkommenState,
  Taetigkeit,
  initialStepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import {
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { render, screen, within } from "@/test-utils/test-utils";

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
    stepAllgemeineAngaben: {
      ...initialStepAllgemeineAngabenState,
      antragstellende: "FuerBeide",
      pseudonym: {
        ET1: "Elternteil 1",
        ET2: "Elternteil 2",
      },
    },
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

  it("should not show form block 'Tätigkeiten' if user is only 'erwerbstätig'", () => {
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

  it("should show selection of 12 months", async () => {
    render(<EinkommenPage />, {
      preloadedState: stateFromPreviousSteps,
    });

    const section = getElternteil1Section();

    await userEvent.click(
      within(section).getByText("eine Tätigkeit hinzufügen"),
    );

    const taetigkeitVonSelection = within(section).getByLabelText("von");
    const taetigkeitBisSelection = within(section).getByLabelText("bis");

    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      const name = `${monthIndex}. Monat`;

      expect(
        within(taetigkeitVonSelection).getByRole("option", { name }),
      ).toBeInTheDocument();

      expect(
        within(taetigkeitBisSelection).getByRole("option", { name }),
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

    expect(
      within(einkommenElternteil1TaetigkeitenVon).queryAllByRole("option"),
    ).toHaveLength(13);

    expect(
      within(einkommenElternteil1TaetigkeitenBis).queryAllByRole("option"),
    ).toHaveLength(13);
  });

  it("should show 'Mini-Job' when choose 'Einkünfte aus nichtselbständiger Arbeit'", async () => {
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
        "War diese Tätigkeit ein Mini-Job?",
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
        "War diese Tätigkeit ein Mini-Job?",
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
      zeitraum: [{ from: "9", to: "12" }],
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

    it("should require the Durchschnittliches Bruttoeinkommen", async () => {
      render(<EinkommenPage />, { preloadedState: validFormState });
      const taetigkeit1Section = getTaetigkeit1OfElternteil1Section();

      await userEvent.clear(
        within(taetigkeit1Section).getByLabelText(
          "Durchschnittliches Bruttoeinkommen",
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

      it("should require to-Month to be after from-Month", async () => {
        render(<EinkommenPage />, { preloadedState: validFormState });

        const zeitraum1Section = getTaetigkeit1OfElternteil1Section();

        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("von"),
          "12",
        );
        await userEvent.selectOptions(
          within(zeitraum1Section).getByLabelText("bis"),
          "10",
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
