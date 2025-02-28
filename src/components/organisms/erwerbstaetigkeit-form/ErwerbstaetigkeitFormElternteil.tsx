import { useEffect, useId } from "react";
import { useFormContext } from "react-hook-form";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  YesNoRadio,
} from "@/components/molecules";
import type { ElternteilType } from "@/redux/elternteil-type";
import { Antragstellende } from "@/redux/stepAllgemeineAngabenSlice";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/redux/yes-no";

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
  const { control, watch, setValue } =
    useFormContext<StepErwerbstaetigkeitState>();

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
        control={control}
        rules={{ required: "Dieses Feld ist erforderlich" }}
        name={`${elternteil}.vorGeburt`}
      />

      {wasErwerbstaetig === YesNo.YES && (
        <>
          <ErwerbstaetigkeitCheckboxGroup elternteil={elternteil} />
          {!!isNichtSelbststaendig && !isSelbststaendig && (
            <>
              <YesNoRadio
                legend="Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?"
                control={control}
                rules={{ required: "Dieses Feld ist erforderlich" }}
                name={`${elternteil}.mehrereTaetigkeiten`}
              />

              {mehrereTaetigkeiten === YesNo.NO && (
                <>
                  <YesNoRadio
                    legend="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?"
                    control={control}
                    rules={{ required: "Dieses Feld ist erforderlich" }}
                    name={`${elternteil}.sozialVersicherungsPflichtig`}
                  />

                  <CustomRadioGroup
                    legend="Hatten Sie Einkommen aus einem Mini-Job?"
                    info={miniJobMaxZahlInfoText}
                    control={control}
                    rules={{ required: "Dieses Feld ist erforderlich" }}
                    name={`${elternteil}.monatlichesBrutto`}
                    options={monatlichesBruttoOptions}
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
