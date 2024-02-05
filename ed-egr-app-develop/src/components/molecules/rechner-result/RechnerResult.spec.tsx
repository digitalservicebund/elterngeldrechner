import { RootState } from "../../../redux";
import { initialStepRechnerState } from "../../../redux/stepRechnerSlice";
import { RechnerResult } from "./RechnerResult";
import { render, screen, within } from "../../../test-utils/test-utils";

describe("Rechner Result", () => {
  it("should show the result", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                vonLebensMonat: 1,
                bisLebensMonat: 3,
                basisElternGeld: 1001,
                elternGeldPlus: 2001,
                nettoEinkommen: 3001,
              },
              {
                vonLebensMonat: 6,
                bisLebensMonat: 7,
                basisElternGeld: 1002,
                elternGeldPlus: 2002,
                nettoEinkommen: 3002,
              },
            ],
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    const firstGroup = screen.getAllByLabelText("Lebensmonat von 1 bis 3")[0];
    const secondGroup = screen.getAllByLabelText("Lebensmonat von 6 bis 7")[0];

    expect(within(firstGroup).getByText("1 - 3")).toBeInTheDocument();
    expect(screen.getByText("1.001 €")).toBeInTheDocument(); // BEG
    expect(screen.getByText("4.002 €")).toBeInTheDocument(); //BEG + Netto
    expect(screen.getByText("2.001 €")).toBeInTheDocument(); // EGPlus
    expect(screen.getByText("5.002 €")).toBeInTheDocument(); // EGPlus + Netto
    expect(within(secondGroup).getByText("6 - 7")).toBeInTheDocument();
    expect(screen.getByText("1.002 €")).toBeInTheDocument(); // BEG
    expect(screen.getByText("4.004 €")).toBeInTheDocument(); //BEG + Netto
    expect(screen.getByText("2.002 €")).toBeInTheDocument(); // EGPlus
    expect(screen.getByText("5.004 €")).toBeInTheDocument(); // EGPlus + Netto
  });

  it("should not display a range of lebensmonat if the start is the same as the end", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                vonLebensMonat: 1,
                bisLebensMonat: 1,
                basisElternGeld: 1001,
                elternGeldPlus: 2001,
                nettoEinkommen: 3001,
              },
            ],
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    const singleItemGroup = screen.getAllByLabelText("Lebensmonat 1")[0];
    expect(within(singleItemGroup).getByText("1")).toBeInTheDocument();
  });

  it("should show an info text if BEG was calculated for over 14 months", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                vonLebensMonat: 14,
                bisLebensMonat: 17,
                basisElternGeld: 1001,
                elternGeldPlus: 2001,
                nettoEinkommen: 3001,
              },
            ],
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    expect(screen.getByText("1.001 €")).toBeInTheDocument();
    expect(screen.getByText("4.002 €")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Basiselterngeld können Sie nur bis zum 14. Lebensmonat beantragen/,
      ),
    ).toBeInTheDocument();
  });

  it("should hide months with zero amount of BEG and EGPlus", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              // BEG is zero
              {
                vonLebensMonat: 1,
                bisLebensMonat: 1,
                basisElternGeld: 0,
                elternGeldPlus: 2001,
                nettoEinkommen: 3001,
              },
              // EGPlus is zero
              {
                vonLebensMonat: 2,
                bisLebensMonat: 2,
                basisElternGeld: 1001,
                elternGeldPlus: 0,
                nettoEinkommen: 3001,
              },
              // BEG and EGPlus is zero
              {
                vonLebensMonat: 3,
                bisLebensMonat: 3,
                basisElternGeld: 0,
                elternGeldPlus: 0,
                nettoEinkommen: 3001,
              },
            ],
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    expect(screen.getAllByLabelText("Lebensmonat 1")).toHaveLength(2);
    expect(screen.getAllByLabelText("Lebensmonat 2")).toHaveLength(2);
    expect(screen.queryAllByLabelText("Lebensmonat 3")).toHaveLength(0);
  });

  it("should show an error message if the calculation has failed", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "error",
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    expect(
      screen.getByText("Das Elterngeld konnte nicht berechnet werden."),
    ).toBeInTheDocument();
  });

  it("should display Max Elterngeld Notification", () => {
    const preloadedState: Partial<RootState> = {
      stepRechner: {
        ...initialStepRechnerState,
        ET1: {
          ...initialStepRechnerState.ET1,
          elterngeldResult: {
            state: "success",
            data: [
              {
                vonLebensMonat: 1,
                bisLebensMonat: 1,
                basisElternGeld: 1800,
                elternGeldPlus: 900,
                nettoEinkommen: 900,
              },
            ],
          },
        },
      },
    };

    render(<RechnerResult elternteil="ET1" />, { preloadedState });

    expect(
      screen.getByText(
        "Von Ihrem Netto Einkommen werden höchstens 2770 Euro für die Festlegung des Elterngelds berücksichtigt. In den Lebensmonaten, in denen Sie kein Einkommen haben, bekommen Sie den Elterngeld-Höchstbetrag von 1800 Euro (ohne Geschwisterbonus). In den Lebensmonaten, in denen Sie Einkommen haben, wird Ihr Elterngeld berechnet aus dem Unterschied zwischen 2770 Euro und Ihrem Einkommen nach der Geburt.",
      ),
    ).toBeInTheDocument();
  });
});
