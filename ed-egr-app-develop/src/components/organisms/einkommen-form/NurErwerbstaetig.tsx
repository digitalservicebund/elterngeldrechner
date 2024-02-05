import type { ElternteilType } from "@egr/monatsplaner-app";
import { VFC } from "react";
import { useFormContext } from "react-hook-form";
import { StepEinkommenState } from "../../../redux/stepEinkommenSlice";
import { Button, P } from "../../atoms";
import {
  CustomNumberField,
  FormFieldGroup,
  SelectOption,
} from "../../molecules";
import nsp from "../../../globals/js/namespace";
import { infoTexts } from "../../molecules/info-dialog";

interface NurErwerbstaetigProps {
  elternteil: ElternteilType;
  monthsBeforeBirth: SelectOption[];
}

export const NurErwerbstaetig: VFC<NurErwerbstaetigProps> = ({
  elternteil,
  monthsBeforeBirth,
}) => {
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
          <section
            aria-label="Einkommen pro Monat"
            className={nsp("einkommen-form__per-month")}
          >
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
          </section>
        )}
      </FormFieldGroup>
    </>
  );
};
