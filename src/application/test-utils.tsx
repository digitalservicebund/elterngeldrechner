import {
  RenderHookResult,
  RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { EventProvider } from "@/application/features/abfrageteil-next/events/EventContext";
import {
  Route,
  type FormEvent,
} from "@/application/features/abfrageteil-next/routing";
import { Steuerklasse } from "@/elterngeldrechner";
import { Temporal } from "@js-temporal/polyfill";

type TestOptions = RenderOptions & { initialEvents?: FormEvent[] };

function TestWrapper({
  children,
  initialEvents,
}: {
  readonly children: ReactNode;
  readonly initialEvents?: FormEvent[];
}) {
  return (
    <EventProvider initialEvents={initialEvents}>
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    </EventProvider>
  );
}

const renderWithProviders = (
  ui: ReactElement,
  { initialEvents, ...renderOptions }: TestOptions = {},
) => {
  function Wrapper({ children }: { readonly children?: ReactNode }) {
    return <TestWrapper initialEvents={initialEvents}>{children}</TestWrapper>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

function renderHookWithProviders<Result, Props>(
  renderFn: (props: Props) => Result,
  { initialEvents, ...renderOptions }: TestOptions = {},
): RenderHookResult<Result, Props> {
  function Wrapper({ children }: { readonly children?: ReactNode }) {
    return <TestWrapper initialEvents={initialEvents}>{children}</TestWrapper>;
  }

  return renderHook(renderFn, { wrapper: Wrapper, ...renderOptions });
}

const INITIAL_EVENTS: FormEvent[] = [
  { route: Route.Startseite },
  {
    route: Route.AllgemeineAngaben,
    payload: {
      bundesland: "Berlin",
      gesamteinkommenGrenzeUeberschritten: false,
    },
  },
  { route: Route.KindAbfrage, payload: { istGeboren: true } },
  {
    route: Route.GeborenesKindAngaben,
    payload: {
      geburtsdatum: Temporal.PlainDate.from("2025-01-01"),
      errechneterEntbindungstermin: Temporal.PlainDate.from("2025-01-01"),
      anzahl: 1,
    },
  },
  { route: Route.GeschwisterkindAbfrage, payload: { istVorhanden: false } },
  {
    route: Route.ElternteilEinsAllgemeineAngaben,
    payload: {
      name: "Jane",
      istAlleinerziehend: false,
      istImMutterschutz: false,
    },
  },
  {
    route: Route.ElternteilAusklammerungGruendeAngaben,
    params: { elternteilIndex: 0 },
    payload: {
      hatKeineAusklammerungsgruende: true,
      hatMutterschutzAelteresKind: false,
      hatElterngeldAelteresKind: false,
      hatSchwangerschaftsbedingteErkrankung: false,
    },
  },
  {
    route: Route.ElternteilTaetigkeitenAbfrage,
    params: { elternteilIndex: 0 },
    payload: {
      istNichtSelbststaendig: true,
      istSelbststaendig: false,
      istVerbeamtet: false,
      hatAndereLeistungen: false,
      hatPeriodenOhneEinkommen: false,
    },
    dependentValues: { istPersonAlleinerziehend: false },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
    params: { elternteilIndex: 0, taetigkeitIndex: 0 },
    payload: { istTaetigkeitMinijob: false },
    dependentValues: { kannDurchschnittAngegebenWerden: true },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
    params: { elternteilIndex: 0, taetigkeitIndex: 0 },
    payload: {
      steuerklasse: Steuerklasse.I,
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: true,
      istGesetzlichRentenversichert: true,
      istGesetzlichArbeitlosenversichert: true,
      istEinkommenGleichVerteilt: true,
    },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenEinkommen,
    params: { elternteilIndex: 0, taetigkeitIndex: 0 },
    payload: { durchschnittlichesMonatsbrutto: 3000 },
    dependentValues: { istMischeinkunft: false },
  },
  {
    route: Route.ElternteilWeitereTaetigkeitAbfrage,
    params: { elternteilIndex: 0, taetigkeitIndex: 0 },
    payload: { istWeitereTaetigkeitVorhanden: false },
    dependentValues: {
      istSelbststaendigeTaetigkeitMoeglich: false,
      istPersonAlleinerziehend: false,
    },
  },
  {
    route: Route.ElternteilZweiAllgemeineAngaben,
    payload: {
      wirdZweitePersonBeruecksichtigt: true,
      name: "John",
      istImMutterschutz: false,
    },
    dependentValues: { hatPotenzielleAusklammerungen: false },
  },
  {
    route: Route.ElternteilTaetigkeitenAbfrage,
    params: { elternteilIndex: 1 },
    payload: {
      istNichtSelbststaendig: true,
      istSelbststaendig: false,
      istVerbeamtet: false,
      hatAndereLeistungen: false,
      hatPeriodenOhneEinkommen: false,
    },
    dependentValues: { istPersonAlleinerziehend: false },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
    params: { elternteilIndex: 1, taetigkeitIndex: 0 },
    payload: { istTaetigkeitMinijob: false },
    dependentValues: { kannDurchschnittAngegebenWerden: true },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
    params: { elternteilIndex: 1, taetigkeitIndex: 0 },
    payload: {
      steuerklasse: Steuerklasse.I,
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: true,
      istGesetzlichRentenversichert: true,
      istGesetzlichArbeitlosenversichert: true,
      istEinkommenGleichVerteilt: true,
    },
  },
  {
    route: Route.ElternteilTaetigkeitAngabenEinkommen,
    params: { elternteilIndex: 1, taetigkeitIndex: 0 },
    payload: { durchschnittlichesMonatsbrutto: 3000 },
    dependentValues: { istMischeinkunft: false },
  },
  {
    route: Route.ElternteilWeitereTaetigkeitAbfrage,
    params: { elternteilIndex: 1, taetigkeitIndex: 0 },
    payload: { istWeitereTaetigkeitVorhanden: false },
    dependentValues: {
      istSelbststaendigeTaetigkeitMoeglich: false,
      istPersonAlleinerziehend: false,
    },
  },
];

// re-export everything
export * from "@testing-library/react";

// override render and renderHook
export {
  renderHookWithProviders as renderHook,
  renderWithProviders as render,
  INITIAL_EVENTS,
};
