import { useFormContext } from "react-hook-form";
import type { ElternteilType } from "@/monatsplaner";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { Button, P } from "@/components/atoms";
import {
  CustomNumberField,
  FormFieldGroup,
  SelectOption,
} from "@/components/molecules";
import nsp from "@/globals/js/namespace";
import { infoTexts } from "@/components/molecules/info-dialog";

interface NurErwerbstaetigProps {
  elternteil: ElternteilType;
  monthsBeforeBirth: SelectOption[];
}

export const NurErwerbstaetig = ({
  elternteil,
  monthsBeforeBirth,
}: NurErwerbstaetigProps) => {
  const { control, setValue, watch } = useFormContext<StepEinkommenState>();

  const averageOrMonthlyNichtSelbstaendig = watch(
    `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`,
  );

  const toggleBruttoEinkommenNichtSelbstaendigState = () =>
    setValue(
      `${elternteil}.bruttoEinkommenNichtSelbstaendig.type`,
      averageOrMonthlyNichtSelbstaendig === "average" ? "monthly" : "average",
    );

  return (
    <>
      <FormFieldGroup headline="Einkünfte aus nichtselbständiger Arbeit">
        {averageOrMonthlyNichtSelbstaendig === "average" && (
          <CustomNumberField
            control={control}
            name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.average`}
            label="Wie viel haben Sie in den 12 Kalendermonaten vor der Geburt ihres Kindes monatlich brutto verdient?"
            suffix="Euro"
            required={true}
            info={infoTexts.einkommenNichtSelbststaendig}
          />
        )}
        {averageOrMonthlyNichtSelbstaendig === "average" && (
          <P
            className={nsp(
              `einkommen-form__ausfuerliche-eingabe-text-${elternteil.toLowerCase()}`,
            )}
          >
            Wenn das Einkommen zwischen den Monaten sehr schwankte, klicken Sie
            bitte auf „ausführliche Eingabe“ und geben die Monate einzeln ein.
          </P>
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
            className={nsp("einkommen-form__per-month")}
          >
            <legend>
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
                  Monate, in denen Sie weniger Einkommen wegen Ihres
                  Wehrdienstes oder Zivildienstes hatten
                </li>
              </ul>
              Stattdessen werden frühere Monate berücksichtigt, damit der
              Zeitraum, der für die Feststellung Ihres Einkommens vor der Geburt
              zählt, insgesamt 12 Monate enthält.
            </legend>

            {monthsBeforeBirth.map(({ label }, index) => (
              <CustomNumberField
                key={label}
                control={control}
                name={`${elternteil}.bruttoEinkommenNichtSelbstaendig.perMonth.${index}`}
                label={label}
                suffix="Euro"
                required={true}
              />
            ))}
          </fieldset>
        )}
      </FormFieldGroup>
    </>
  );
};
