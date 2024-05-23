import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RechnerForm } from "./RechnerForm";
import { initialStepRechnerState } from "@/redux/stepRechnerSlice";
import store from "@/redux";

describe("RechnerForm", () => {
  it("should render form and display Elternteil Name", async () => {
    // when
    render(
      <Provider store={store}>
        <RechnerForm
          elternteil="ET1"
          elternteilName="Elternteil 1"
          initialValues={initialStepRechnerState}
          isResultPending
          onSubmit={() => {}}
          previousFormStepsChanged={false}
        />
      </Provider>,
    );

    // then
    expect(screen.getByText("Elternteil 1")).toBeInTheDocument();
  });

  // Test for Bug https://issues.init.de/browse/EGR-174
  it("should show Bruttoeinkommen, when 'Kein Einkommen' is not checked", async () => {
    // setup
    render(
      <Provider store={store}>
        <RechnerForm
          elternteil="ET1"
          elternteilName="Elternteil 1"
          initialValues={initialStepRechnerState}
          isResultPending
          onSubmit={() => {}}
          previousFormStepsChanged={false}
        />
      </Provider>,
    );
    const checkBoxLabel =
      "Ich werde während des gesamten Elterngeldbezugs kein Einkommen beziehen";
    const labelEinkommen =
      "Ihr monatliches Bruttoeinkommen oder durchschnittlicher monatlicher Gewinn während des Bezugs von Elterngeld";
    const checkBoxKeinEinkommen = screen.getByText(checkBoxLabel);

    // initial state
    expect(checkBoxKeinEinkommen).toBeInTheDocument();
    expect(checkBoxKeinEinkommen).toBeEnabled();
    expect(screen.queryByText(labelEinkommen)).not.toBeInTheDocument();

    // first check
    await userEvent.click(checkBoxKeinEinkommen);
    expect(screen.queryByText(labelEinkommen)).not.toBeInTheDocument();

    // show Bruttoeinkommen (Bug EGR-174)
    await userEvent.click(checkBoxKeinEinkommen);
    expect(screen.getByText(labelEinkommen)).toBeInTheDocument();

    // hide Bruttoeinkommen
    await userEvent.click(checkBoxKeinEinkommen);
    expect(screen.queryByText(labelEinkommen)).not.toBeInTheDocument();
  });
});
