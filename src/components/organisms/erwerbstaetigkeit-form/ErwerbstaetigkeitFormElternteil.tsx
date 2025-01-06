import { useEffect, useId } from "react";
import { useFormContext } from "react-hook-form";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  YesNoRadio,
} from "@/components/molecules";
import { InfoDialog, infoTexts } from "@/components/molecules/info-dialog";
import type { ElternteilType } from "@/redux/elternteil-type";
import { Antragstellende } from "@/redux/stepAllgemeineAngabenSlice";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/redux/yes-no";

const monatlichesBruttoLabels: { [K in MonatlichesBrutto]: string } = {
  MiniJob: "Ja",
  MehrAlsMiniJob: "Nein",
};

const monatlichesBruttoOptions: CustomRadioGroupOption<MonatlichesBrutto>[] = [
  {
    value: "MiniJob",
    label: monatlichesBruttoLabels.MiniJob,
  },
  {
    value: "MehrAlsMiniJob",
    label: monatlichesBruttoLabels.MehrAlsMiniJob,
  },
];

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
    reset,
    getValues,
  } = useFormContext<StepErwerbstaetigkeitState>();
  const wasErwerbstaetig = watch(`${elternteil}.vorGeburt`);
  const isNichtSelbststaendig = watch(`${elternteil}.isNichtSelbststaendig`);
  const isSelbststaendig = watch(`${elternteil}.isSelbststaendig`);
  const mehrereTaetigkeiten = watch(`${elternteil}.mehrereTaetigkeiten`);

  useEffect(() => {
    if (wasErwerbstaetig === YesNo.NO) {
      if (elternteil === "ET1") {
        reset({
          ...getValues(),
          ET1: {
            ...initialStepErwerbstaetigkeitElternteil,
            vorGeburt: YesNo.NO,
          },
        });
      }
      if (elternteil === "ET2") {
        reset({
          ...getValues(),
          ET2: {
            ...initialStepErwerbstaetigkeitElternteil,
            vorGeburt: YesNo.NO,
          },
        });
      }
    }
  }, [elternteil, reset, wasErwerbstaetig, getValues]);

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
                    legend={
                      <div className="flex items-center justify-between">
                        <span>Hatten Sie Einkommen aus einem Mini-Job?</span>
                        <InfoDialog info={infoTexts.minijobsMaxZahl} />
                      </div>
                    }
                    register={register}
                    registerOptions={{
                      required: "Dieses Feld ist erforderlich",
                    }}
                    name={`${elternteil}.monatlichesBrutto`}
                    errors={errors}
                    options={monatlichesBruttoOptions}
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
