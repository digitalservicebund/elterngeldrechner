import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { useEffect, useId } from "react";
import { useFormContext } from "react-hook-form";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import {
  InfoZuMiniJobs,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
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

type ErwerbstaetikeitFormElternteilProps = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragssteller: Antragstellende | null;
};

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
    <section aria-labelledby={hasHeading ? headingIdentifier : undefined}>
      {!!hasHeading && (
        <h3 id={headingIdentifier} className="mb-16">
          <PersonIcon className="mr-8" />
          {heading}
        </h3>
      )}

      <div className="flex flex-col gap-56">
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
                      slotBetweenLegendAndOptions={<InfoZuMiniJobs />}
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
      </div>
    </section>
  );
}

export default ErwerbstaetigkeitFormElternteil;
