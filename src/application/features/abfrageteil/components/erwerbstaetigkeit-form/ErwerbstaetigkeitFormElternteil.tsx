import { useEffect, useId } from "react";
import { useFormContext } from "react-hook-form";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  YesNoRadio,
} from "@/application/components/molecules";
import {
  type Antragstellende,
  type ElternteilType,
  type MonatlichesBrutto,
  type StepErwerbstaetigkeitState,
  YesNo,
  initialStepErwerbstaetigkeitElternteil,
} from "@/application/features/abfrageteil/state";

const monatlichesBruttoOptions: CustomRadioGroupOption<MonatlichesBrutto>[] = [
  {
    value: "MiniJob",
    label: "Ja",
  },
  {
    value: "MehrAlsMiniJob",
    label: "Nein",
  },
];

const miniJobMaxZahlInfoText = `Mini-Job - geringfügige Beschäftigung bis maximal 538 Euro monatlich
- vor dem 01.01.2024: bis maximal 520 Euro monatlich
- vor dem 01.10.2022: bis maximal 450 Euro monatlich`;

interface ErwerbstaetikeitFormElternteilProps {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragssteller: Antragstellende | null;
}

function ErwerbstaetigkeitFormElternteil({
  elternteil,
  elternteilName,
  antragssteller,
}: ErwerbstaetikeitFormElternteilProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<StepErwerbstaetigkeitState>();

  const wasErwerbstaetig = watch(`${elternteil}.vorGeburt`);
  const isNichtSelbststaendig = watch(`${elternteil}.isNichtSelbststaendig`);
  const isSelbststaendig = watch(`${elternteil}.isSelbststaendig`);
  const mehrereTaetigkeiten = watch(`${elternteil}.mehrereTaetigkeiten`);

  useEffect(() => {
    if (wasErwerbstaetig === YesNo.NO) {
      setValue(`${elternteil}`, {
        ...initialStepErwerbstaetigkeitElternteil,
        vorGeburt: YesNo.NO,
      });
    }
  }, [elternteil, wasErwerbstaetig, setValue]);

  const heading = elternteilName;
  const hasHeading = antragssteller === "FuerBeide";
  const headingIdentifier = useId();

  return (
    <section
      className="flex flex-col gap-32"
      aria-labelledby={hasHeading ? headingIdentifier : undefined}
    >
      {!!hasHeading && <h3 id={headingIdentifier}>{heading}</h3>}

      <YesNoRadio
        legend="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes erwerbstätig?"
        register={register}
        registerOptions={{ required: "Dieses Feld ist erforderlich" }}
        name={`${elternteil}.vorGeburt`}
        errors={errors}
        required
      />

      {wasErwerbstaetig === YesNo.YES && (
        <>
          <ErwerbstaetigkeitCheckboxGroup elternteil={elternteil} />
          {!!isNichtSelbststaendig && !isSelbststaendig && (
            <>
              <YesNoRadio
                legend="Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?"
                register={register}
                registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                name={`${elternteil}.mehrereTaetigkeiten`}
                errors={errors}
                required
              />

              {mehrereTaetigkeiten === YesNo.NO && (
                <>
                  <YesNoRadio
                    legend="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?"
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name={`${elternteil}.sozialVersicherungsPflichtig`}
                    errors={errors}
                    required
                  />

                  <CustomRadioGroup
                    legend="Hatten Sie Einkommen aus einem Mini-Job?"
                    info={miniJobMaxZahlInfoText}
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name={`${elternteil}.monatlichesBrutto`}
                    options={monatlichesBruttoOptions}
                    errors={errors}
                    required
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default ErwerbstaetigkeitFormElternteil;
