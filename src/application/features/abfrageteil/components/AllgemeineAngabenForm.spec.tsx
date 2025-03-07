import userEvent from "@testing-library/user-event";
import { produce } from "immer";
import { describe, expect, it } from "vitest";
import { AllgemeineAngabenForm } from "./AllgemeineAngabenForm";
import { YesNo } from "@/application/features/abfrageteil/state";
import { INITIAL_STATE, render, screen } from "@/application/test-utils";

describe("Allgemeine Angaben Page", () => {
  it("should display the Alleinerziehendenstatus part of the form right away", () => {
    render(<AllgemeineAngabenForm />);

    expect(screen.getByText("Alleinerziehendenstatus")).toBeInTheDocument();
  });

  it("should display the Antragstellenden part of the form after the Alleinerziehendenstatus", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Nein"));

    expect(screen.getByText("Eltern")).toBeInTheDocument();
  });

  it("should display the optional naming part of the form after the Antragstellenden part", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    expect(screen.getByText("Ihre Namen (optional)")).toBeInTheDocument();
  });

  it("should ask for Mutterschaftssleistungen if Gemeinsam Erziehende", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    expect(screen.getByText("Mutterschutz")).toBeInTheDocument();
  });

  it("should ask for Mutterschaftssleistungen if Alleinerziehend", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Ja"));

    expect(screen.getByText("Mutterschutz")).toBeInTheDocument();
  });

  it("should ask to whom Mutterschaftsleistungen belongs if Gemeinsam Erziehende", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Nein"));

    await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));

    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.getByText(
        "Welcher Elternteil ist oder wird im Mutterschutz sein?",
      ),
    ).toBeInTheDocument();
  });

  it("should not ask to whom Mutterschaftsleistungen belongs if Alleinerziehend", async () => {
    render(<AllgemeineAngabenForm />);

    await userEvent.click(screen.getByLabelText("Ja"));

    await userEvent.click(
      screen.getByTestId("mutterschaftssleistungen_option_0"),
    );

    expect(
      screen.queryByText(
        "Welcher Elternteil ist oder wird im Mutterschutz sein?",
      ),
    ).not.toBeInTheDocument();
  });

  describe("Submitting the form", () => {
    it("should persist the step", async () => {
      const { store } = render(<AllgemeineAngabenForm />);

      await userEvent.click(screen.getByLabelText("Ja"));
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_0"),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        antragstellende: "EinenElternteil",
        alleinerziehend: YesNo.YES,
        mutterschaftssleistungen: YesNo.YES,
      });
    });

    it("should persist the pseudonym", async () => {
      const { store } = render(<AllgemeineAngabenForm />);

      await userEvent.click(screen.getByLabelText("Nein"));
      await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 1"),
        "Finn",
      );
      await userEvent.type(
        screen.getByLabelText("Name für Elternteil 2"),
        "Fiona",
      );
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_0"),
      );
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungenWer_option_0"),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        alleinerziehend: YesNo.NO,
        antragstellende: "FuerBeide",
        mutterschaftssleistungen: YesNo.YES,
        mutterschaftssleistungenWer: "ET1",
        pseudonym: {
          ET1: "Finn",
          ET2: "Fiona",
        },
      });
    });

    it("should reset alleinerziehend if Antragstellende für beide", async () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        draft.stepAllgemeineAngaben.alleinerziehend = YesNo.YES;
      });

      const { store } = render(<AllgemeineAngabenForm />, { preloadedState });

      await userEvent.click(screen.getByLabelText("Nein"));
      await userEvent.click(screen.getByLabelText("Für zwei Elternteile"));
      await userEvent.click(
        screen.getByTestId("mutterschaftssleistungen_option_1"),
      );
      await userEvent.click(screen.getByText("Weiter"));

      expect(store.getState().stepAllgemeineAngaben).toMatchObject({
        antragstellende: "FuerBeide",
        alleinerziehend: YesNo.NO,
        mutterschaftssleistungen: YesNo.NO,
      });
    });

    it("should show a validation error if some information is missing", async () => {
      const invalidFormState = produce(INITIAL_STATE, (draft) => {
        draft.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
        draft.stepAllgemeineAngaben.alleinerziehend = null;
        draft.stepAllgemeineAngaben.mutterschaftssleistungen = YesNo.YES;
      });

      render(<AllgemeineAngabenForm />, { preloadedState: invalidFormState });

      await userEvent.click(screen.getByText("Weiter"));

      expect(
        screen.getByText("Dieses Feld ist erforderlich"),
      ).toBeInTheDocument();
    });
  });
});
