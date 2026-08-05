import { Route } from "@/application/routing";
import { Zeitraum } from "@/bemessungszeitraumrechner";
import { formatiereBemessungszeitraum } from "../../domain/formatiereBemessungszeitraum";

type ElternteilTaetigkeitenUebersichtsBoxProps = {
  readonly currentRoute: Route;
  readonly taetigkeitIndex: number;
  readonly taetigkeitenFlow: "Selbstaendig" | "Nicht-Selbstaendig";
  readonly bemessungszeitraum: Zeitraum[];
};

export function ElternteilTaetigkeitenUebersichtsBox({
  currentRoute,
  taetigkeitIndex,
  taetigkeitenFlow,
  bemessungszeitraum,
}: ElternteilTaetigkeitenUebersichtsBoxProps) {
  const formatierterBemessungszeitraum =
    formatiereBemessungszeitraum(bemessungszeitraum);

  return (
    <div>
      <div className="input-container rounded bg-primary-light/40 p-24">
        {erstelleUeberschrift(currentRoute, taetigkeitIndex)}

        <div className="inline-block rounded bg-primary-light px-16 pb-4">
          {erstelleTaetigkeitsPlakette(currentRoute, taetigkeitIndex)}
        </div>

        <div>
          {taetigkeitenFlow === "Selbstaendig" ? (
            <p className="mt-0">
              Bemessungszeitraum: Kalenderjahr {bemessungszeitraum[0]?.von.year}
            </p>
          ) : (
            <>
              <p className="mt-0">Bemessungszeitraum:</p>
              <ul>
                {formatierterBemessungszeitraum.map((zeitraum, index) => (
                  <li key={index} className="mt-0">
                    {zeitraum}{" "}
                    {index + 1 < formatierterBemessungszeitraum.length
                      ? "und"
                      : ""}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function erstelleUeberschrift(currentRoute: Route, taetigkeitIndex: number) {
  if (taetigkeitIndex > 0) {
    return <></>;
  }

  if (currentRoute === Route.ElternteilTaetigkeitenAngestelltHauptjob) {
    return (
      <>
        <h3>Wir fragen zuerst die Details zu Ihrem Hauptjob ab:</h3>
        <p>
          Die Angaben zu eventuellen Nebenjobs können Sie im Anschluss machen.
        </p>
      </>
    );
  }

  if (currentRoute === Route.ElternteilTaetigkeitenMinijobAngaben) {
    return <h3>Wir fragen nun die Details zu Ihrem Minijob ab:</h3>;
  }

  if (currentRoute === Route.ElternteilTaetigkeitenSelbststaendigAngaben) {
    return <h3>Wir fragen nun die Details zu Ihrer Selbstständigkeit ab:</h3>;
  }

  return <></>;
}

function bestimmeNummerierung(
  currentRoute: Route,
  taetigkeitIndex: number,
  weitereRoute: Route,
): string {
  if (taetigkeitIndex === 0 || currentRoute === weitereRoute) {
    return "";
  }
  return `${taetigkeitIndex + 1}.`;
}

function bestimmeAngestelltSuffix(
  currentRoute: Route,
  taetigkeitIndex: number,
): string {
  if (currentRoute === Route.ElternteilTaetigkeitenAngestelltWeitere) {
    return "";
  }

  if (taetigkeitIndex === 0) {
    return " | Hauptjob";
  }

  if (taetigkeitIndex === 1) {
    return " | Nebenjob";
  }

  return ` | ${taetigkeitIndex}. Nebenjob`;
}

function erstelleTaetigkeitsPlakette(
  currentRoute: Route,
  taetigkeitIndex: number,
) {
  if (
    currentRoute === Route.ElternteilTaetigkeitenAngestelltHauptjob ||
    currentRoute === Route.ElternteilTaetigkeitenAngestelltAngaben ||
    currentRoute === Route.ElternteilTaetigkeitenAngestelltEinkommen ||
    currentRoute ===
      Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert ||
    currentRoute === Route.ElternteilTaetigkeitenAngestelltWeitere
  ) {
    return `Angestellt${bestimmeAngestelltSuffix(currentRoute, taetigkeitIndex)}`;
  }

  if (
    currentRoute === Route.ElternteilTaetigkeitenMinijobAngaben ||
    currentRoute === Route.ElternteilTaetigkeitenMinijobEinkommen ||
    currentRoute === Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert ||
    currentRoute === Route.ElternteilTaetigkeitenMinijobWeiterer
  ) {
    return `${bestimmeNummerierung(currentRoute, taetigkeitIndex, Route.ElternteilTaetigkeitenMinijobWeiterer)} Minijob`;
  }

  if (
    currentRoute === Route.ElternteilTaetigkeitenSelbststaendigAngaben ||
    currentRoute === Route.ElternteilTaetigkeitenSelbststaendigWeitere
  ) {
    return `${bestimmeNummerierung(currentRoute, taetigkeitIndex, Route.ElternteilTaetigkeitenSelbststaendigWeitere)} Selbstständigkeit`;
  }

  return "";
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ElternteilTaetigkeitenUebersichtsBox", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { Temporal } = await import("@js-temporal/polyfill");

    const BMZ_MIT_EINEM_ZEITRAUM = [
      {
        von: Temporal.PlainYearMonth.from("2024-11"),
        bis: Temporal.PlainYearMonth.from("2025-10"),
      },
    ];

    describe("Überschrift", () => {
      it("shows the Hauptjob-Einleitung for AngestelltHauptjob at taetigkeitIndex 0", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltHauptjob}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(
          screen.getByRole("heading", {
            name: "Wir fragen zuerst die Details zu Ihrem Hauptjob ab:",
          }),
        ).toBeVisible();
      });

      it("shows the Minijob-Einleitung for MinijobAngaben at taetigkeitIndex 0", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenMinijobAngaben}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(
          screen.getByRole("heading", {
            name: "Wir fragen nun die Details zu Ihrem Minijob ab:",
          }),
        ).toBeVisible();
      });

      it("shows the Selbststaendigkeit-Einleitung for SelbststaendigAngaben at taetigkeitIndex 0", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenSelbststaendigAngaben}
            taetigkeitIndex={0}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(
          screen.getByRole("heading", {
            name: "Wir fragen nun die Details zu Ihrer Selbstständigkeit ab:",
          }),
        ).toBeVisible();
      });

      it("shows no heading once taetigkeitIndex is greater than 0", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltHauptjob}
            taetigkeitIndex={1}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
      });
    });

    describe("Tätigkeits-Plakette", () => {
      it("labels the first Angestellt Taetigkeit as Hauptjob", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltHauptjob}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Angestellt | Hauptjob")).toBeVisible();
      });

      it("labels the second Angestellt Taetigkeit as Nebenjob", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltAngaben}
            taetigkeitIndex={1}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Angestellt | Nebenjob")).toBeVisible();
      });

      it("numbers the third and later Angestellt Nebenjobs", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltEinkommen}
            taetigkeitIndex={2}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Angestellt | 2. Nebenjob")).toBeVisible();
      });

      it("drops the Hauptjob/Nebenjob suffix on the AngestelltWeitere page", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltWeitere}
            taetigkeitIndex={1}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Angestellt")).toBeVisible();
      });

      it("labels the first Minijob without a number", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenMinijobAngaben}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Minijob")).toBeVisible();
      });

      it("numbers the second Minijob", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenMinijobEinkommen}
            taetigkeitIndex={1}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("2. Minijob")).toBeVisible();
      });

      it("drops the number on the MinijobWeiterer page", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenMinijobWeiterer}
            taetigkeitIndex={1}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Minijob")).toBeVisible();
      });

      it("labels the first Selbststaendigkeit without a number", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenSelbststaendigAngaben}
            taetigkeitIndex={0}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Selbstständigkeit")).toBeVisible();
      });

      it("numbers the second Selbststaendigkeit", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenSelbststaendigAngaben}
            taetigkeitIndex={1}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("2. Selbstständigkeit")).toBeVisible();
      });

      it("drops the number on the SelbststaendigWeitere page", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenSelbststaendigWeitere}
            taetigkeitIndex={1}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByText("Selbstständigkeit")).toBeVisible();
      });

      it("shows no Plakette for a route none of the branches match", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenBMZUebersicht}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.queryByText("Angestellt")).not.toBeInTheDocument();
        expect(screen.queryByText("Minijob")).not.toBeInTheDocument();
        expect(screen.queryByText("Selbstständigkeit")).not.toBeInTheDocument();
      });
    });

    describe("Bemessungszeitraum", () => {
      it("shows a single Kalenderjahr for Selbstaendig", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenSelbststaendigAngaben}
            taetigkeitIndex={0}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={[
              {
                von: Temporal.PlainYearMonth.from("2024-01"),
                bis: Temporal.PlainYearMonth.from("2024-12"),
              },
            ]}
          />,
        );

        expect(
          screen.getByText("Bemessungszeitraum: Kalenderjahr 2024"),
        ).toBeVisible();
      });

      it("lists a single Zeitraum without a trailing 'und'", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltHauptjob}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={BMZ_MIT_EINEM_ZEITRAUM}
          />,
        );

        expect(screen.getByRole("listitem")).toHaveTextContent(
          "November 2024 bis Oktober 2025",
        );
      });

      it("joins two Zeitraeume with 'und'", () => {
        render(
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={Route.ElternteilTaetigkeitenAngestelltHauptjob}
            taetigkeitIndex={0}
            taetigkeitenFlow="Nicht-Selbstaendig"
            bemessungszeitraum={[
              {
                von: Temporal.PlainYearMonth.from("2024-11"),
                bis: Temporal.PlainYearMonth.from("2025-01"),
              },
              {
                von: Temporal.PlainYearMonth.from("2025-03"),
                bis: Temporal.PlainYearMonth.from("2025-10"),
              },
            ]}
          />,
        );

        const [erster, zweiter] = screen.getAllByRole("listitem");
        expect(erster).toHaveTextContent("November 2024 bis Januar 2025 und");
        expect(zweiter).toHaveTextContent("März bis Oktober 2025");
      });
    });
  });
}
