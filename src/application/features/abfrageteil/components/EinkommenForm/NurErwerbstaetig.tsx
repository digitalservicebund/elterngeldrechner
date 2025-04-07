import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { InfoEinkommenFuerErwerbstaetige } from "./InfoEinkommenFuerErwerbstaetige";
import { Button } from "@/application/components";
import {
  CustomNumberField,
  type SelectOption,
} from "@/application/features/abfrageteil/components/common";
import type {
  ElternteilType,
  StepEinkommenState,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly elternteil: ElternteilType;
  readonly monthsBeforeBirth: SelectOption[];
};

export function NurErwerbstaetig({ elternteil, monthsBeforeBirth }: Props) {
  const { control, setValue, watch } = useFormContext<StepEinkommenState>();

  const averageOrMonthlyNichtSelbstaendig = watch(
    `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`,
  );

  const toggleBruttoEinkommenNichtSelbstaendigState = () =>
    setValue(
      `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`,
      averageOrMonthlyNichtSelbstaendig === "average" ? "monthly" : "average",
    );

  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="mb-10">
        Einkünfte aus nichtselbständiger Arbeit
      </h3>

      {averageOrMonthlyNichtSelbstaendig === "average" && (
        <div>
          <p className="mb-16">
            Wie viel haben Sie in den 12 Kalendermonaten vor der Geburt Ihres
            Kindes <strong>monatlich</strong> brutto verdient?
          </p>

          <InfoEinkommenFuerErwerbstaetige />

          <CustomNumberField
            className="mt-16"
            control={control}
            name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.average`}
            label="Monatliches Einkommen in Brutto"
            suffix="Euro"
            required
          />
        </div>
      )}
      {averageOrMonthlyNichtSelbstaendig === "average" && (
        <p className="my-16">
          Wenn das Einkommen zwischen den Monaten sehr schwankte, klicken Sie
          bitte auf „ausführliche Eingabe“ und geben die Monate einzeln ein.
        </p>
      )}
      <Button
        type="button"
        buttonStyle="secondary"
        onClick={toggleBruttoEinkommenNichtSelbstaendigState}
      >
        {averageOrMonthlyNichtSelbstaendig === "average"
          ? "Zur ausführlichen Eingabe"
          : "Zur einfachen Eingabe"}
      </Button>

      {averageOrMonthlyNichtSelbstaendig === "monthly" && (
        <fieldset
          name="Einkommen pro Monat"
          className="my-16 flex flex-wrap gap-16"
        >
          <legend className="mb-10">
            Geben Sie an, wie viel Sie in den 12 Monaten vor der Geburt Ihres
            Kindes monatlich verdient haben.
            <br />
            Ausgenommen sind:
            <ul className="list-disc pl-16">
              <li>Monate in denen Sie im Mutterschutz waren</li>
              <li>
                Monate in denen Sie Elterngeld für ein älteres Kind in dessen
                ersten 14 Lebensmonaten bekommen haben
              </li>
              <li>
                Monate, in denen Sie weniger Einkommen hatten wegen einer
                Erkrankung, die maßgeblich auf Ihre Schwangerschaft
                zurückzuführen war
              </li>
              <li>
                Monate, in denen Sie weniger Einkommen wegen Ihres Wehrdienstes
                oder Zivildienstes hatten
              </li>
            </ul>
            Stattdessen werden frühere Monate berücksichtigt, damit der
            Zeitraum, der für die Feststellung Ihres Einkommens vor der Geburt
            zählt, insgesamt 12 Monate enthält.
          </legend>

          <ol className="grid grid-cols-2 gap-16 [&_input]:w-full">
            {monthsBeforeBirth.map(({ label }, index) => (
              <li key={label}>
                <CustomNumberField
                  control={control}
                  name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.perMonth.${index}`}
                  label={label}
                  suffix="Euro"
                  required
                />
              </li>
            ))}
          </ol>
        </fieldset>
      )}
    </section>
  );
}
