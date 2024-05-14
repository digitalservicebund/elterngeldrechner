import { fireEvent, render, screen } from "../../../test-utils/test-utils";
import userEvent from "@testing-library/user-event";
import { Monatsplaner } from "./Monatsplaner";
import nsp from "../../../globals/js/namespace";
import { RootState } from "../../../redux";
import { initialStepNachwuchsState } from "../../../redux/stepNachwuchsSlice";
import { initialStepAllgemeineAngabenState } from "../../../redux/stepAllgemeineAngabenSlice";
import {
  initialMonatsplanerState,
  MonatsplanerState,
} from "../../../redux/monatsplanerSlice";
import { initialStepRechnerState } from "../../../redux/stepRechnerSlice";
import {
  changeMonth,
  createElternteile,
  validateElternteile,
  ValidationResult,
} from "../../../monatsplaner";
import { createDefaultElternteileSettings } from "../../../globals/js/elternteile-utils";
import { YesNo } from "../../../globals/js/calculations/model";

const getElternteilEGLabel = (name: string, eg: string, monthIndex: number) =>
  `${name} ${eg} für Lebensmonat ${monthIndex + 1}`;

const getElternteilBEGLabel = (name: string, monthIndex: number) =>
  getElternteilEGLabel(name, "Basiselterngeld", monthIndex);

const getElternteilEGPLabel = (name: string, monthIndex: number) =>
  getElternteilEGLabel(name, "ElterngeldPlus", monthIndex);

const getElternteil1BEGLabel = (monthIndex: number) =>
  getElternteilBEGLabel("Elternteil 1", monthIndex);

const getElternteil1PSBLabel = (monthIndex: number) =>
  `Elternteil 1 Partnerschaftsbonus für Lebensmonat ${monthIndex + 1}`;

const testLebensmonateLabels = [
  "1 August",
  "2 September",
  "3 Oktober",
  "4 November",
  "5 Dezember",
  "6 Januar",
  "7 Februar",
  "8 März",
  "9 April",
  "10 Mai",
  "11 Juni",
  "12 Juli",
  "13 August",
  "14 September",
  "15 Oktober",
  "16 November",
  "17 Dezember",
  "18 Januar",
  "19 Februar",
  "20 März",
  "21 April",
  "22 Mai",
  "23 Juni",
  "24 Juli",
  "25 August",
  "26 September",
  "27 Oktober",
  "28 November",
  "29 Dezember",
  "30 Januar",
  "31 Februar",
  "32 März",
];

jest.setTimeout(90000);
jest.mock("../../../monatsplaner", () => {
  // mock only specific function of imported library
  const actual = jest.requireActual("../../../monatsplaner");

  return {
    ...actual,
    validateElternteile: jest.fn(),
  };
});

describe("Monatsplaner", () => {
  const numberOfMutterschutzMonths = 2;

  const defaultElternteileSettings = createDefaultElternteileSettings(
    false,
    false,
    "2022-08-08T00:00:00Z",
    "ET1",
    2,
    true,
  );
  const defaultElternteileSettingsForBoth = createDefaultElternteileSettings(
    false,
    false,
    "2022-08-08T00:00:00Z",
    "ET1",
    2,
    true,
  );
  const preloadedState: Partial<RootState> = {
    monatsplaner: {
      ...initialMonatsplanerState,
      mutterschutzElternteil: "ET1",
      settings: defaultElternteileSettings,
      partnerMonate: true,
      elternteile: createElternteile(defaultElternteileSettings),
    },
    stepAllgemeineAngaben: {
      ...initialStepAllgemeineAngabenState,
      antragstellende: "EinElternteil",
    },
    stepNachwuchs: {
      ...initialStepNachwuchsState,
      wahrscheinlichesGeburtsDatum: "08.08.2022",
    },
    stepRechner: {
      ...initialStepRechnerState,
      ET1: {
        ...initialStepRechnerState.ET1,
        elterngeldResult: {
          state: "success",
          data: [
            {
              vonLebensMonat: 1,
              bisLebensMonat: 32,
              elternGeldPlus: 1001,
              basisElternGeld: 2001,
              nettoEinkommen: 3001,
            },
          ],
        },
      },
      ET2: {
        ...initialStepRechnerState.ET2,
        elterngeldResult: {
          state: "success",
          data: [
            {
              vonLebensMonat: 1,
              bisLebensMonat: 32,
              elternGeldPlus: 1002,
              basisElternGeld: 2002,
              nettoEinkommen: 3002,
            },
          ],
        },
      },
    },
  };
  const stateForBoth: Partial<RootState> = {
    ...preloadedState,
    monatsplaner: {
      ...initialMonatsplanerState,
      mutterschutzElternteil: "ET1",
      settings: defaultElternteileSettingsForBoth,
      partnerMonate: true,
      elternteile: createElternteile(defaultElternteileSettingsForBoth),
    },
    stepAllgemeineAngaben: {
      ...initialStepAllgemeineAngabenState,
      antragstellende: "FuerBeide",
      pseudonym: {
        ET1: "Frida",
        ET2: "Manfred",
      },
    },
  };

  it("should display overlay information modal when no calculation was triggered by user", () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: {
        ...preloadedState,
        stepRechner: initialStepRechnerState,
      },
    });

    const infoText = screen.getByText(
      "Bevor Sie den Monatsplaner nutzen können, machen Sie bitte Angaben zu Ihrem Brutto-Einkommen während des Elterngeldbezugs",
    );
    expect(infoText).toBeInTheDocument();
  });

  it("should show summation footer", () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

    const footer = screen.queryByRole("contentinfo", { name: "Gesamtsumme" });

    expect(footer).toBeVisible();
  });

  it("should display info text", () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: {
        ...preloadedState,
        stepRechner: initialStepRechnerState,
      },
    });

    const infoText = screen.getByText(
      "Dieses Ergebnis ist nicht rechtsverbindlich. Erst nach der Geburt Ihres Kindes kann Ihre zuständige Elterngeldstelle eine konkrete und rechtsverbindliche Berechnung Ihres Anspruchs vornehmen.",
    );
    expect(infoText).toBeInTheDocument();
  });

  describe("Lebensmonate", () => {
    it("should display first 18 Lebensmonate in a column with number of month and month name", () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

      for (const month of testLebensmonateLabels.slice(0, 18)) {
        expect(screen.getByLabelText(month)).toBeInTheDocument();
      }
    });

    it("should display all Lebensmonate in a column with number of month and month name", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

      const expandButton = screen.getByRole("button", {
        name: "Alle Monate anzeigen",
      });

      await userEvent.click(expandButton);

      for (const month of testLebensmonateLabels) {
        expect(screen.getByLabelText(month)).toBeInTheDocument();
      }
    });

    it("should hide the Alle Monate anzeigen Button if it was clicked", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const button = screen.getByRole("button", {
        name: "Alle Monate anzeigen",
      });

      await userEvent.click(button);

      expect(
        screen.queryByRole("button", {
          name: "Alle Monate anzeigen",
        }),
      ).not.toBeInTheDocument();
    });
  });

  it("should show the Planer for both Elternteile", () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: stateForBoth,
    });

    expect(screen.queryByRole("columnheader", { name: "Frida" })).toBeVisible();
    expect(
      screen.queryByRole("columnheader", { name: "Manfred" }),
    ).toBeVisible();
  });

  it("should select a single month", async () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    const month = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );

    await userEvent.click(month);

    const monthWrapper = screen.getByTestId(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );
    expect(monthWrapper).toHaveClass(nsp("monatsplaner-month--selected"));
  });

  it("should deselect a single month", async () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    const month = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );

    await userEvent.click(month);
    await userEvent.click(month);

    const monthWrapper = screen.getByTestId(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );
    expect(monthWrapper).not.toHaveClass(nsp("monatsplaner-month--selected"));
  });

  it("should select multiple months by dragging", async () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    const month1 = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );
    const month2 = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths + 1),
    );

    const monthWrapper = screen.getByTestId(
      getElternteil1BEGLabel(numberOfMutterschutzMonths + 1),
    );

    await userEvent.click(month1);
    fireEvent.mouseOver(month2, { buttons: 1 });

    expect(monthWrapper).toHaveClass(nsp("monatsplaner-month--selected"));
  });

  it("should deselect multiple months by dragging", async () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    const month1 = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths),
    );
    const month2 = screen.getByLabelText(
      getElternteil1BEGLabel(numberOfMutterschutzMonths + 1),
    );

    //select 2 months
    await userEvent.click(month1);
    await userEvent.click(month2);
    //deselect the first and drag down
    await userEvent.click(month1);
    fireEvent.mouseOver(month2, { buttons: 1 });

    expect(month2).not.toHaveClass(nsp("monatsplaner-month--selected"));
  });

  it("should show notification on click on last available month that there are zero remaining month of this type", async () => {
    // render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: stateForBoth,
    });

    const expandButton = screen.getByRole("button", {
      name: "Alle Monate anzeigen",
    });
    await userEvent.click(expandButton);

    // select 8 month EG+ (2 MS + 8 EG+ (3.-10.) = 6)
    for (let i = 0; i < 8; i++) {
      const month = screen.getByLabelText(
        getElternteilEGPLabel("Frida", numberOfMutterschutzMonths + i),
      );
      await userEvent.click(month);
    }

    // select 4 month BG (2 MS + 8 EG+ (3.-10.) + 4 BG (11.-14.) = 10)
    for (let i = 8; i < 12; i++) {
      await userEvent.click(
        screen.getByLabelText(
          getElternteilBEGLabel("Frida", numberOfMutterschutzMonths + i),
        ),
      );
    }

    // select 3 month EG+ (2 MS + 8 EG+ + 4 BG + 3 EG+ = 11,5)
    for (let i = 12; i < 19; i++) {
      await userEvent.click(
        screen.getByLabelText(
          getElternteilEGPLabel("Frida", numberOfMutterschutzMonths + i),
        ),
      );
    }

    const notificationBEGZeroMonthAvailable = screen.getByText(
      /ihre verfügbaren Basiselterngeld-Monate sind aufgebraucht/i,
    );
    expect(notificationBEGZeroMonthAvailable).toBeInTheDocument();

    // select 1 month EG+ (2 MS + 8 EG+ + 4 BG + 3 EG+ + 1 EG+ = 12)
    await userEvent.click(
      screen.getByLabelText(
        getElternteilEGPLabel("Frida", numberOfMutterschutzMonths + 19),
      ),
    );

    const notificationEGZeroMonthAvailable = screen.getByText(
      /ihre verfügbaren Basiselterngeld- und ElterngeldPlus-Monate sind aufgebraucht/i,
    );
    expect(notificationEGZeroMonthAvailable).toBeInTheDocument();
  });

  it("should show notification on click on 11 + 1 beg month", async () => {
    //render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: stateForBoth,
    });
    const expandButton = screen.getByRole("button", {
      name: "Alle Monate anzeigen",
    });
    await userEvent.click(expandButton);

    // select 1 month BEG (2 MS + 9 BG + 1 BG = 12)
    for (let i = 0; i < 10; i++) {
      await userEvent.click(
        screen.getByLabelText(
          getElternteilBEGLabel("Frida", numberOfMutterschutzMonths + i),
        ),
      );
    }

    expect(
      screen.getByText(
        /jeder Elternteil muss mindestens 2 und darf maximal 12 Monate Elterngeld beantragen/i,
      ),
    ).toBeInTheDocument();
  });

  it("should show notification when not have continuous EG months", async () => {
    //render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
    render(<Monatsplaner mutterSchutzMonate={0} />, {
      preloadedState: stateForBoth,
    });
    const mockValidateElternteile =
      validateElternteile as jest.Mock<ValidationResult>;

    mockValidateElternteile.mockReturnValue({
      isValid: false,
      errorCodes: ["DoesNotHaveContinuousEGAfterBEGAnspruch"],
    });
    mockValidateElternteile.mockClear();

    const expandButton = screen.getByRole("button", {
      name: "Alle Monate anzeigen",
    });
    await userEvent.click(expandButton);

    const errorToastText =
      /elterngeld muss ab dem 15. Monat durchgängig genommen werden/i;

    expect(screen.queryByText(errorToastText)).not.toBeInTheDocument();

    // select month 20 EGP
    await userEvent.click(
      screen.getByLabelText(getElternteilEGPLabel("Frida", 19)),
    );

    expect(screen.getByText(errorToastText)).toBeInTheDocument();
  });

  it("should not display empty BEG months if remaining months of this type is zero", async () => {
    let elternteile = createElternteile(defaultElternteileSettings);
    //select 10 month BEG (mutterschutz is preselected)
    for (let i = 0; i < 10; i++) {
      elternteile = changeMonth(
        elternteile,
        {
          monthIndex: numberOfMutterschutzMonths + i,
          elternteil: "ET1",
          targetType: "BEG",
        },
        defaultElternteileSettings,
      );
    }
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: {
        ...preloadedState,
        monatsplaner: {
          ...(preloadedState.monatsplaner as MonatsplanerState),
          elternteile,
        },
      },
    });

    const expandButton = screen.getByRole("button", {
      name: "Alle Monate anzeigen",
    });
    await userEvent.click(expandButton);

    const BEGmonthNotThere = screen.queryByLabelText(
      "Elternteil 1 Basiselterngeld für Lebensmonat 13",
    );

    expect(BEGmonthNotThere).toBeInTheDocument();
  });

  it("should not display empty EGPlus months if remaining months of this type is zero", async () => {
    let elternteile = createElternteile(defaultElternteileSettings);
    //select 24 month EGPlus (mutterschutz in BEG is preselected)
    for (let i = 0; i < 24; i++) {
      elternteile = changeMonth(
        elternteile,
        {
          monthIndex: numberOfMutterschutzMonths + i,
          elternteil: "ET1",
          targetType: "EG+",
        },
        defaultElternteileSettings,
      );
    }
    render(<Monatsplaner mutterSchutzMonate={2} />, {
      preloadedState: {
        ...preloadedState,
        monatsplaner: {
          ...(preloadedState.monatsplaner as MonatsplanerState),
          elternteile,
        },
      },
    });

    const expandButton = screen.getByRole("button", {
      name: "Alle Monate anzeigen",
    });
    await userEvent.click(expandButton);

    const EGPlusMonthNotThere = screen.queryByLabelText(
      "Elternteil 1 ElterngeldPlus für Lebensmonat 27",
    );

    expect(EGPlusMonthNotThere).not.toBeInTheDocument();
  });

  it("should not allow to change a Mutterschutz month to EG+", () => {
    render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

    for (let i = 0; i < numberOfMutterschutzMonths; i++) {
      expect(
        screen.queryByLabelText(
          `Elternteil 1 ElterngeldPlus für Lebensmonat ${i + 1}`,
        ),
      ).not.toBeInTheDocument();
    }
  });

  describe("simultaneous BEG selection", () => {
    const preloadedState: Partial<RootState> = {
      stepAllgemeineAngaben: {
        ...initialStepAllgemeineAngabenState,
        antragstellende: "FuerBeide",
      },
    };

    // TODO: Use this across whole file to simplify test code.
    function getElternteil1BEGMonth(monthIndex: number): HTMLElement {
      const labelText = getElternteilBEGLabel("Elternteil 1", monthIndex);
      return screen.getByLabelText(labelText);
    }

    function getElternteil2BEGMonth(monthIndex: number): HTMLElement {
      const labelText = getElternteilBEGLabel("Elternteil 2", monthIndex);
      return screen.getByLabelText(labelText);
    }

    function queryElternteil1BEGMonth(monthIndex: number): HTMLElement | null {
      const labelText = getElternteilBEGLabel("Elternteil 1", monthIndex);
      return screen.queryByLabelText(labelText);
    }

    function queryElternteil2BEGMonth(monthIndex: number): HTMLElement | null {
      const labelText = getElternteilBEGLabel("Elternteil 2", monthIndex);
      return screen.queryByLabelText(labelText);
    }

    async function selectSimultaneousBEGMonth(monthIndex: number) {
      await userEvent.click(getElternteil1BEGMonth(monthIndex));
      await userEvent.click(getElternteil2BEGMonth(monthIndex));
    }

    it("should disable the same BEG month of the other parent when selecting BEG months after the first simultaneous one", async () => {
      render(<Monatsplaner mutterSchutzMonate={0} />, { preloadedState });
      await selectSimultaneousBEGMonth(0);

      await userEvent.click(getElternteil1BEGMonth(3));
      await userEvent.click(getElternteil2BEGMonth(11));

      expect(queryElternteil2BEGMonth(3)).not.toBeInTheDocument();
      expect(queryElternteil1BEGMonth(11)).not.toBeInTheDocument();
    });

    it("should always disable BEG months of the other parent after the 12th month", async () => {
      // it("having a simultaneous BEG month, no BEG months get disabled after the 12 month", async () => {
      render(<Monatsplaner mutterSchutzMonate={0} />, { preloadedState });
      await selectSimultaneousBEGMonth(0);

      await userEvent.click(getElternteil1BEGMonth(12));
      await userEvent.click(getElternteil2BEGMonth(13));

      expect(queryElternteil2BEGMonth(12)).not.toBeInTheDocument();
      expect(queryElternteil1BEGMonth(13)).not.toBeInTheDocument();
    });

    it("should not disable any BEG month if multiple kids are expected", async () => {
      const stateWithMehrlinge = { ...preloadedState };
      stateWithMehrlinge.monatsplaner = {
        ...initialMonatsplanerState,
        settings: {
          mehrlinge: true,
          behindertesGeschwisterkind: false,
          partnerMonate: false,
        },
      };
      render(<Monatsplaner mutterSchutzMonate={0} />, {
        preloadedState: stateWithMehrlinge,
      });
      await selectSimultaneousBEGMonth(0);

      await userEvent.click(getElternteil1BEGMonth(3));
      await userEvent.click(getElternteil2BEGMonth(11));

      expect(queryElternteil2BEGMonth(3)).toBeInTheDocument();
      expect(queryElternteil1BEGMonth(11)).toBeInTheDocument();
    });

    it("should not disable any BEG month if there is a disabled sibling", async () => {
      const stateWithBehindertesGeschwisterKind = { ...preloadedState };
      stateWithBehindertesGeschwisterKind.monatsplaner = {
        ...initialMonatsplanerState,
        settings: {
          behindertesGeschwisterkind: true,
          mehrlinge: false,
          partnerMonate: false,
        },
      };
      render(<Monatsplaner mutterSchutzMonate={0} />, {
        preloadedState: stateWithBehindertesGeschwisterKind,
      });
      await selectSimultaneousBEGMonth(0);

      await userEvent.click(getElternteil1BEGMonth(3));
      await userEvent.click(getElternteil2BEGMonth(11));

      expect(queryElternteil2BEGMonth(3)).toBeInTheDocument();
      expect(queryElternteil1BEGMonth(11)).toBeInTheDocument();
    });

    it("should show a notification when the first simultaneous BEG month was selected", async () => {
      render(<Monatsplaner mutterSchutzMonate={0} />, { preloadedState });

      await selectSimultaneousBEGMonth(0);

      expect(
        screen.queryByText(
          /Basiselterngeld können Sie nur für einen Lebensmonat in den ersten 12 Lebensmonaten gleichzeitig bekommen./,
        ),
      ).toBeVisible();
    });

    it("should not show a notification when multiple kids are expected", async () => {
      const stateWithMehrlinge = { ...preloadedState };
      stateWithMehrlinge.monatsplaner = {
        ...initialMonatsplanerState,
        settings: {
          mehrlinge: true,
          behindertesGeschwisterkind: false,
          partnerMonate: false,
        },
      };
      render(<Monatsplaner mutterSchutzMonate={0} />, {
        preloadedState: stateWithMehrlinge,
      });

      await selectSimultaneousBEGMonth(0);

      expect(
        screen.queryByText(
          /In den ersten 12 Monaten kann maximal ein Monat parallel BasisElterngeld beantragt werden./,
        ),
      ).not.toBeInTheDocument();
    });

    it("should not show a notification when there is a disabled sibling", async () => {
      const stateWithBehindertesGeschwisterKind = { ...preloadedState };
      stateWithBehindertesGeschwisterKind.monatsplaner = {
        ...initialMonatsplanerState,
        settings: {
          behindertesGeschwisterkind: true,
          mehrlinge: false,
          partnerMonate: false,
        },
      };
      render(<Monatsplaner mutterSchutzMonate={0} />, {
        preloadedState: stateWithBehindertesGeschwisterKind,
      });

      await selectSimultaneousBEGMonth(0);

      expect(
        screen.queryByText(
          /In den ersten 12 Monaten kann maximal ein Monat parallel BasisElterngeld beantragt werden./,
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("PSB selection", () => {
    it("should not show a notification if PSB is selected and if there is only one Elternteil", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(3));

      await userEvent.click(PSBMonth);

      expect(
        screen.queryByText(
          /Partnerschaftsbonus ändert sich immer auch beim anderen Elternteil/,
        ),
      ).not.toBeInTheDocument();
    });

    it("should show a notification that other months was automatically selected if no PSB was selected before and there is only one Elternteil", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));

      await userEvent.click(PSBMonth);

      const infoText = screen.getByText(
        /Auch Monat Januar wurde automatisch ausgewählt/,
      );

      expect(infoText).toBeInTheDocument();
    });

    it("should show a notification that other months was automatically selected and changes occur for other Elternteil if no PSB was selected before and there are two Elternteile", async () => {
      const stateForBoth: Partial<RootState> = {
        ...preloadedState,
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "FuerBeide",
        },
      };

      render(<Monatsplaner mutterSchutzMonate={2} />, {
        preloadedState: stateForBoth,
      });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(3));

      await userEvent.click(PSBMonth);

      const infoText1 = screen.getByText(
        /Partnerschaftsbonus ändert sich immer auch beim anderen/,
      );
      const infoText2 = screen.getByText(
        /Auch Monat Dezember wurde automatisch ausgewählt/,
      );

      expect(infoText1).toBeInTheDocument();
      expect(infoText2).toBeInTheDocument();
    });

    it("should show a notification that a PSB month is not deselectable", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));
      const secondPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(5));
      const thirdPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(6));

      await userEvent.click(PSBMonth);
      await userEvent.click(thirdPSBMonth);
      await userEvent.click(secondPSBMonth);

      expect(
        screen.getByText(/Dieser Monat kann nicht abgewählt werden/),
      ).toBeInTheDocument();
    });

    it("should show a notification that a PSB month is not deselectable if user clicks in same month but other Elterngeld type column", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));
      const thirdPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(6));
      const secondBEGMonth = screen.getByLabelText(getElternteil1BEGLabel(5));

      await userEvent.click(PSBMonth);
      await userEvent.click(thirdPSBMonth);
      await userEvent.click(secondBEGMonth);

      expect(
        screen.getByText(/Dieser Monat kann nicht abgewählt werden/),
      ).toBeInTheDocument();
    });

    it("should not show a notification if the PSB month is deselectable", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(2));
      const thirdPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));

      await userEvent.click(PSBMonth);
      await userEvent.click(thirdPSBMonth);
      await userEvent.click(thirdPSBMonth);

      expect(
        screen.queryByText(/Dieser Monat kann nicht abgewählt werden/),
      ).not.toBeInTheDocument();
    });

    it("should show a notification if the PSB month is not deselectable via drag", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));
      const secondPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(5));
      const thirdPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(6));

      //select all 4 PSB months
      await userEvent.click(PSBMonth);
      await userEvent.click(thirdPSBMonth);
      const fourthPSBMonth = screen.getByLabelText(getElternteil1PSBLabel(7));
      await userEvent.click(fourthPSBMonth);
      //deselect the 4th and drag around to second
      await userEvent.click(fourthPSBMonth);
      fireEvent.mouseOver(secondPSBMonth, { buttons: 1 });

      expect(
        screen.getByText(/Dieser Monat kann nicht abgewählt werden/),
      ).toBeInTheDocument();
    });

    it("should only display 4 PSB months on screen if one PSB month was selected", async () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));

      await userEvent.click(PSBMonth);

      const PSBmonths = screen.getAllByLabelText(
        /Elternteil 1 Partnerschaftsbonus für Lebensmonat/,
      );

      expect(PSBmonths).toHaveLength(4);
    });

    it("should highlight two PSB months on mouse-over if none PSB month is selected", () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });
      const PSBMonth = screen.getByLabelText(getElternteil1PSBLabel(4));
      const highlightedMonth = screen.getByTestId(getElternteil1PSBLabel(5));

      fireEvent.mouseOver(PSBMonth);

      expect(highlightedMonth).toHaveClass(
        nsp("monatsplaner-month--highlighted"),
      );
    });

    it("should not allow to change any Mutterschutz month to PSB", () => {
      render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

      for (let i = 0; i < numberOfMutterschutzMonths; i++) {
        expect(
          screen.queryByLabelText(
            `Elternteil 1 Partnerschaftsbonus für Lebensmonat ${i + 1}`,
          ),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByLabelText(
            `Elternteil 2 Partnerschaftsbonus für Lebensmonat ${i + 1}`,
          ),
        ).not.toBeInTheDocument();
      }
    });
    it("should not hide PSB selection if alleinerziehend", () => {
      const { container } = render(<Monatsplaner mutterSchutzMonate={2} />, {
        preloadedState: {
          ...preloadedState,
          stepAllgemeineAngaben: {
            ...initialStepAllgemeineAngabenState,
            antragstellende: "EinElternteil",
            alleinerziehend: YesNo.YES,
          },
        },
      });

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const partnerschaftsbonus = container.querySelector(
        ".egr-remaining-months__partnerschaftsbonus",
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const bonus = container.querySelector(
        ".egr-elternteil__th--partnerschaftsbonus",
      );
      expect(partnerschaftsbonus).not.toBeNull();
      expect(bonus).not.toBeNull();
    });

    it("should show PSB selection if not alleinerziehend", () => {
      const { container } = render(<Monatsplaner mutterSchutzMonate={2} />, {
        preloadedState: {
          ...preloadedState,
          stepAllgemeineAngaben: {
            ...initialStepAllgemeineAngabenState,
            antragstellende: "EinElternteil",
            alleinerziehend: YesNo.NO,
          },
        },
      });

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const partnerschaftsbonus = container.querySelector(
        ".egr-remaining-months__partnerschaftsbonus",
      );
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      const bonus = container.querySelector(
        ".egr-elternteil__th--partnerschaftsbonus",
      );
      expect(partnerschaftsbonus).not.toBeNull();
      expect(bonus).not.toBeNull();
    });
  });

  describe("Submit validation Monatsplaner", () => {
    const mockValidateElternteile =
      validateElternteile as jest.Mock<ValidationResult>;

    beforeEach(() => {
      mockValidateElternteile.mockClear();
    });

    it.each([
      [
        /mindestens ein Elternteil muss Elterngeld beantragen/i,
        "HasNoSelection" as const,
      ],
      [
        /reduzieren Sie auf die verfügbare Anzahl von Basiselterngeld-Monaten/i,
        "HasTakenMoreThanTheAvailableBEGMonths" as const,
      ],
      [
        /nur 1 Monat Elterngeld für ein Elternteil ist nicht zulässig/i,
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll" as const,
      ],
      [
        /Elterngeld muss ab dem 15. Monat durchgängig genommen werden/i,
        "DoesNotHaveContinuousEGAfterBEGAnspruch" as const,
      ],
      [
        /Basiselterngeld kann nicht nach dem 15. Monat genommen werden/i,
        "HasTakenBEGAfterBEGAnspruch" as const,
      ],
    ])(
      "should show error message %p if validation returns error code %p",
      async (expectedText, errorCode) => {
        render(<Monatsplaner mutterSchutzMonate={2} />, { preloadedState });

        mockValidateElternteile.mockReturnValue({
          isValid: false,
          errorCodes: [errorCode],
        });

        const submitButton = screen.getByRole("button", {
          name: "Zur Übersicht",
        });
        await userEvent.click(submitButton);

        expect(screen.getByText(expectedText)).toBeInTheDocument();
      },
    );
  });

  describe("repeat planning", () => {
    it("should reset the selected months when repeat planning", async () => {
      render(<Monatsplaner mutterSchutzMonate={0} />);
      const firstBEGMonth = getElternteil1BEGLabel(0);
      const monthButton = screen.getByLabelText(firstBEGMonth);
      const monthCell = screen.getByTestId(firstBEGMonth);
      const repeatButton = screen.getByText("Planung wiederholen");

      expect(monthCell).not.toHaveClass(nsp("monatsplaner-month--selected"));

      await userEvent.click(monthButton);
      expect(monthCell).toHaveClass(nsp("monatsplaner-month--selected"));

      await userEvent.click(repeatButton);
      expect(monthCell).not.toHaveClass(nsp("monatsplaner-month--selected"));
    });

    it("should not reset 'Mutterschutz' months when repeat planning", async () => {
      render(<Monatsplaner mutterSchutzMonate={1} />, { preloadedState });
      const maternityProtectionMonth = getElternteil1BEGLabel(0);
      const monthCell = screen.getByTestId(maternityProtectionMonth);
      const repeatButton = screen.getByText("Planung wiederholen");

      expect(monthCell).toHaveClass(nsp("monatsplaner-month--selected"));
      await userEvent.click(repeatButton);
      expect(monthCell).toHaveClass(nsp("monatsplaner-month--selected"));
    });

    it("triggers scrolling when repeat planning", async () => {
      render(<Monatsplaner mutterSchutzMonate={0} />);
      const scrollMock = jest.fn();
      window.HTMLElement.prototype.scrollIntoView = scrollMock;
      const repeatButton = screen.getByText("Planung wiederholen");

      await userEvent.click(repeatButton);

      expect(scrollMock).toHaveBeenCalledTimes(1);

      scrollMock.mockRestore();
    });
  });
});
