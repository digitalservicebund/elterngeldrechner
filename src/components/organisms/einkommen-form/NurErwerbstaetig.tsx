import { useFormContext } from "react-hook-form";
import { useId } from "react";
import type { ElternteilType } from "@/redux/elternteil-type";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { Button } from "@/components/atoms";
import { CustomNumberField, SelectOption } from "@/components/molecules";
import { infoTexts } from "@/components/molecules/info-dialog";

interface NurErwerbstaetigProps {
  readonly elternteil: ElternteilType;
  readonly monthsBeforeBirth: SelectOption[];
}

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
        <CustomNumberField
          control={control}
          name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.average`}
          label="Wie viel haben Sie in den 12 Kalendermonaten vor der Geburt Ihres Kindes monatlich brutto verdient?"
          suffix="Euro"
          required
          info={infoTexts.einkommenNichtSelbststaendig}
        />
      )}
      {averageOrMonthlyNichtSelbstaendig === "average" && (
        <p
          className={`egr-einkommen-form__ausfuerliche-eingabe-text-${elternteil.toLowerCase()}`}
        >
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
          className="egr-einkommen-form__per-month"
        >
          <legend className="mb-10">
            Geben Sie an, wie viel Sie in den 12 Monaten vor der Geburt Ihres
            Kindes monatlich verdient haben.
            <br />
            Ausgenommen sind:
            <ul>
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
