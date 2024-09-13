import userEvent from "@testing-library/user-event";
import { Monatsplaner } from "./Monatsplaner";
import { fireEvent, render, screen } from "@/test-utils/test-utils";
import nsp from "@/globals/js/namespace";
import { RootState } from "@/redux";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import {
  initialMonatsplanerState,
  MonatsplanerState,
} from "@/redux/monatsplanerSlice";
import { initialStepRechnerState } from "@/redux/stepRechnerSlice";
import { changeMonth, createElternteile } from "@/monatsplaner";
import { createDefaultElternteileSettings } from "@/globals/js/elternteile-utils";
import { YesNo } from "@/globals/js/calculations/model";

const getElternteilEGLabel = (name: string, eg: string, monthIndex: number) =>
  `${name} ${eg} für Lebensmonat ${monthIndex + 1}`;

const getElternteilBEGLabel = (name: string, monthIndex: number) =>
  getElternteilEGLabel(name, "Basiselterngeld", monthIndex);

const getElternteil1BEGLabel = (monthIndex: number) =>
  getElternteilBEGLabel("Elternteil 1", monthIndex);

const getElternteil1PSBLabel = (monthIndex: number) =>
  `Elternteil 1 Partnerschaftsbonus für Lebensmonat ${monthIndex + 1}`;

vi.mock("../../../monatsplaner", async (importOriginal) => {
  const module = await importOriginal<typeof import("../../../monatsplaner")>();
  return { ...module, validateElternteile: vi.fn() };
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
      antragstellende: "EinenElternteil",
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

    const BEGmonthNotThere = screen.queryByLabelText(
      "Elternteil 1 Basiselterngeld für Lebensmonat 13",
    );

    expect(BEGmonthNotThere).not.toBeInTheDocument();
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
      stepNachwuchs: {
        ...initialStepNachwuchsState,
        wahrscheinlichesGeburtsDatum: "08.08.2022",
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
  });

  describe("PSB selection", () => {
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
            antragstellende: "EinenElternteil",
            alleinerziehend: YesNo.YES,
          },
        },
      });

      const bonus = container.querySelector(
        ".egr-elternteil__th--partnerschaftsbonus",
      );
      expect(bonus).not.toBeNull();
    });

    it("should show PSB selection if not alleinerziehend", () => {
      const { container } = render(<Monatsplaner mutterSchutzMonate={2} />, {
        preloadedState: {
          ...preloadedState,
          stepAllgemeineAngaben: {
            ...initialStepAllgemeineAngabenState,
            antragstellende: "EinenElternteil",
            alleinerziehend: YesNo.NO,
          },
        },
      });

      const bonus = container.querySelector(
        ".egr-elternteil__th--partnerschaftsbonus",
      );
      expect(bonus).not.toBeNull();
    });
  });

  describe("partner months", () => {
    it("hides further months when partner reached their limit", async () => {
      const preloadedState: Partial<RootState> = {
        stepAllgemeineAngaben: {
          ...initialStepAllgemeineAngabenState,
          antragstellende: "FuerBeide",
          pseudonym: {
            ET1: "Jane",
            ET2: "John",
          },
        },
        monatsplaner: {
          ...initialMonatsplanerState,
          settings: {
            partnerMonate: true,
            behindertesGeschwisterkind: false,
            mehrlinge: false,
          },
        },
        stepNachwuchs: {
          ...initialStepNachwuchsState,
          wahrscheinlichesGeburtsDatum: "08.08.2022",
        },
      };
      render(<Monatsplaner mutterSchutzMonate={0} />, {
        preloadedState,
      });

      const initialAvailableBEGMonthsET1 = screen.getAllByLabelText(
        /Jane Basiselterngeld für Lebensmonat/,
      );
      expect(initialAvailableBEGMonthsET1).toHaveLength(14);

      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        const begMonthButton = screen.getByLabelText(
          `Jane Basiselterngeld für Lebensmonat ${monthIndex + 1}`,
        );
        await userEvent.click(begMonthButton);
      }

      const finalBEGMonthsET1 = screen.getAllByLabelText(
        /Jane Basiselterngeld für Lebensmonat/,
      );
      expect(finalBEGMonthsET1).toHaveLength(12);

      const remainingBEGMonthsET2 = screen.getAllByLabelText(
        /John Basiselterngeld für Lebensmonat/,
      );
      expect(remainingBEGMonthsET2).toHaveLength(14);
    });
  });
});
