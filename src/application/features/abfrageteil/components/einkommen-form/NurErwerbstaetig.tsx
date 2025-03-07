import { useId } from "react";
import { useFormContext } from "react-hook-form";
import {
  Button,
  CustomNumberField,
  SelectOption,
} from "@/application/components";
import type {
  ElternteilType,
  StepEinkommenState,
} from "@/application/features/abfrageteil/state";

interface NurErwerbstaetigProps {
  readonly elternteil: ElternteilType;
  readonly monthsBeforeBirth: SelectOption[];
}

const einkommenNichtSelbststaendigInfoText =
  "Als Einkommen werden alle Einkünfte aus Ihrer nicht-selbständigen Tätigkeit im Bemessungszeitraum berücksichtigt. Nicht berücksichtigt werden sonstige Bezüge, z.B. Abfindungen, Leistungsprämien, Provisionen, 13. Monatsgehälter. Steuerfreie Einnahmen werden ebenfalls nicht berücksichtigt, z.B. Trinkgelder, steuerfreie Zuschläge, Krankengeld, Kurzarbeitergeld, ALG II";

export function NurErwerbstaetig({
  elternteil,
  monthsBeforeBirth,
}: NurErwerbstaetigProps) {
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
          <p className="mb-8">
            Wie viel haben Sie in den 12 Kalendermonaten vor der Geburt Ihres
            Kindes <strong>monatlich</strong> brutto verdient?
          </p>
          <CustomNumberField
            control={control}
            name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.average`}
            label="Monatliches Einkommen in Brutto"
            suffix="Euro"
            required
            info={einkommenNichtSelbststaendigInfoText}
          />
        </div>
      )}
      {averageOrMonthlyNichtSelbstaendig === "average" && (
        <p className="my-16 text-16">
          Wenn das Einkommen zwischen den Monaten sehr schwankte, klicken Sie
          bitte auf „ausführliche Eingabe“ und geben die Monate einzeln ein.
        </p>
      )}
      <Button
        buttonStyle="secondary"
        onClick={toggleBruttoEinkommenNichtSelbstaendigState}
        label={
          averageOrMonthlyNichtSelbstaendig === "average"
            ? "Zur ausführlichen Eingabe"
            : "Zur einfachen Eingabe"
        }
      />

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
