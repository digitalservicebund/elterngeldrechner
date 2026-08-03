import { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";
import { Control } from "react-hook-form";
import { AusklammerungsZeitraumBox } from "@/application/features/abfrageteil/pages/taetigkeit/AusklammerungsZeitraumBox";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
import {
  Ausklammerung,
  gruppiereBemessungszeitraum,
  Zeitraum,
} from "@/bemessungszeitraumrechner";
import { TaetigkeitUnleichesEinkommenAngaben } from "./TaetigkeitSchema";

export function MonatsgenauEinkommensAbfrage({
  bemessungszeitraum,
  ausklammerungen,
  control,
}: MonatsgenauEinkommensAbfrageProps) {
  const zeitabschnitte = gruppiereBemessungszeitraum({
    bemessungszeitraum,
    ausklammerungen,
  });

  const { gruppierteZeitabschnitte, alleEinkommensMonate } = useMemo(() => {
    const initialAcc = {
      gruppierteZeitabschnitte: [] as Array<
        Temporal.PlainYearMonth[] | Ausklammerung[]
      >,
      alleEinkommensMonate: [] as Temporal.PlainYearMonth[],
    };

    const result = zeitabschnitte.reduce((acc, curr) => {
      const lastGroup =
        acc.gruppierteZeitabschnitte[acc.gruppierteZeitabschnitte.length - 1];

      if (Array.isArray(curr)) {
        acc.gruppierteZeitabschnitte.push(curr);
        acc.alleEinkommensMonate.push(...curr);
      } else {
        if (lastGroup && istGruppierterZeitabschnittAusklammerung(lastGroup)) {
          lastGroup.push(curr);
        } else {
          acc.gruppierteZeitabschnitte.push([curr]);
        }
      }

      return acc;
    }, initialAcc);

    return {
      gruppierteZeitabschnitte: result.gruppierteZeitabschnitte,
      alleEinkommensMonate: result.alleEinkommensMonate,
    };
  }, [zeitabschnitte]);

  return (
    <>
      {gruppierteZeitabschnitte.map((zeitabschnitt, index) => {
        if (istGruppierterZeitabschnittAusklammerung(zeitabschnitt)) {
          return (
            <div key={index}>
              <AusklammerungsZeitraumBox ausklammerungen={zeitabschnitt} />
            </div>
          );
        }

        return (
          <div key={index} className="bg-off-white p-40 pt-32">
            <div className="input-container pl-8">
              {zeitabschnitt.map((month) => {
                const monatsIndex = berechneMonatsindex(
                  month,
                  alleEinkommensMonate,
                );
                const label = `${month.toPlainDate({ day: 1 }).toLocaleString("de-DE", { month: "long", year: "numeric" })} Brutto-Einkommen`;

                return (
                  <CurrencyInput
                    control={control}
                    name={`monatsbrutto.${monatsIndex}`}
                    key={month.toString()}
                    label={label}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function istGruppierterZeitabschnittAusklammerung(
  zeitabschnitt: Temporal.PlainYearMonth[] | Ausklammerung[],
): zeitabschnitt is Ausklammerung[] {
  const ersterZeitabschnitt = zeitabschnitt[0];
  return (
    !!ersterZeitabschnitt &&
    !Array.isArray(ersterZeitabschnitt) &&
    "grund" in ersterZeitabschnitt
  );
}

function berechneMonatsindex(
  aktuellerMonat: Temporal.PlainYearMonth,
  alleMonate: Temporal.PlainYearMonth[],
): number {
  return alleMonate.findIndex((monat) => monat.equals(aktuellerMonat));
}

type MonatsgenauEinkommensAbfrageProps = {
  bemessungszeitraum: Zeitraum[];
  ausklammerungen: Ausklammerung[];
  control: Control<TaetigkeitUnleichesEinkommenAngaben>;
};

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("MonatsgenauEinkommensAbfrage", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { userEvent } = await import("@testing-library/user-event");
    const { useForm } = await import("react-hook-form");

    function TestForm({
      bemessungszeitraum,
      ausklammerungen,
      onSubmit,
    }: {
      bemessungszeitraum: Zeitraum[];
      ausklammerungen: Ausklammerung[];
      onSubmit: (values: TaetigkeitUnleichesEinkommenAngaben) => void;
    }) {
      const { handleSubmit, control } =
        useForm<TaetigkeitUnleichesEinkommenAngaben>();

      return (
        <form onSubmit={handleSubmit((values) => onSubmit(values))}>
          <MonatsgenauEinkommensAbfrage
            bemessungszeitraum={bemessungszeitraum}
            ausklammerungen={ausklammerungen}
            control={control}
          />
          <button type="submit">Absenden</button>
        </form>
      );
    }

    it("renders one CurrencyInput per month of a contiguous Bemessungszeitraum", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TestForm
          bemessungszeitraum={[
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 3 }),
            },
          ]}
          ausklammerungen={[]}
          onSubmit={onSubmit}
        />,
      );

      await user.type(
        screen.getByLabelText("Januar 2024 Brutto-Einkommen"),
        "1000",
      );
      await user.type(
        screen.getByLabelText("Februar 2024 Brutto-Einkommen"),
        "2000",
      );
      await user.type(
        screen.getByLabelText("März 2024 Brutto-Einkommen"),
        "3000",
      );
      await user.click(screen.getByRole("button", { name: "Absenden" }));

      expect(onSubmit).toHaveBeenCalledWith({
        monatsbrutto: [1000, 2000, 3000],
      });
    });

    it("shows the Ausklammerung between the two groups of Monate it separates", () => {
      render(
        <TestForm
          bemessungszeitraum={[
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 2 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 4 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 5 }),
            },
          ]}
          ausklammerungen={[
            {
              von: Temporal.PlainDate.from({ year: 2024, month: 3, day: 5 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 3, day: 7 }),
              grund: "Krankheit",
            },
          ]}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByText("Übersprungener Zeitraum:")).toBeVisible();
      expect(screen.getByText("Krankheit", { exact: false })).toBeVisible();

      expect(
        screen.getByLabelText("Januar 2024 Brutto-Einkommen"),
      ).toBeVisible();
      expect(
        screen.getByLabelText("April 2024 Brutto-Einkommen"),
      ).toBeVisible();
    });

    it("merges two adjacent Ausklammerungen with no Monat between them into a single box", () => {
      render(
        <TestForm
          bemessungszeitraum={[
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 2 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 4 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 5 }),
            },
          ]}
          ausklammerungen={[
            {
              von: Temporal.PlainDate.from({ year: 2024, month: 3, day: 5 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 3, day: 7 }),
              grund: "Krankheit",
            },
            {
              von: Temporal.PlainDate.from({ year: 2024, month: 3, day: 10 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 3, day: 12 }),
              grund: "mutterschutz",
            },
          ]}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByText("Übersprungene Zeiträume:")).toBeVisible();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
      expect(
        screen.getByText("Krankheit 05.03.2024 bis 07.03.2024"),
      ).toBeVisible();
      expect(
        screen.getByText(
          "Mutterschutz für dieses Kind 10.03.2024 bis 12.03.2024",
        ),
      ).toBeVisible();
    });

    it("keeps the monatsbrutto index continuous across the Monate on either side of an Ausklammerung", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <TestForm
          bemessungszeitraum={[
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 2 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 4 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 5 }),
            },
          ]}
          ausklammerungen={[
            {
              von: Temporal.PlainDate.from({ year: 2024, month: 3, day: 5 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 3, day: 7 }),
              grund: "Krankheit",
            },
          ]}
          onSubmit={onSubmit}
        />,
      );

      await user.type(
        screen.getByLabelText("Januar 2024 Brutto-Einkommen"),
        "100",
      );
      await user.type(
        screen.getByLabelText("Februar 2024 Brutto-Einkommen"),
        "200",
      );
      await user.type(
        screen.getByLabelText("April 2024 Brutto-Einkommen"),
        "400",
      );
      await user.type(
        screen.getByLabelText("Mai 2024 Brutto-Einkommen"),
        "500",
      );
      await user.click(screen.getByRole("button", { name: "Absenden" }));

      expect(onSubmit).toHaveBeenCalledWith({
        monatsbrutto: [100, 200, 400, 500],
      });
    });
  });
}
