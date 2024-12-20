import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import type { ElternteilType } from "@/redux/elternteil-type";
import {
  CustomRadioGroup,
  FormFieldGroup,
  CustomRadioGroupOption,
  YesNoRadio,
} from "@/components/molecules";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/globals/js/calculations/model";
import { infoTexts } from "@/components/molecules/info-dialog";
import { Antragstellende } from "@/redux/stepAllgemeineAngabenSlice";

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

  return (
    <section>
      <FormFieldGroup
        headline={antragssteller === "FuerBeide" ? elternteilName : ""}
        description="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes erwerbstätig?"
      >
        <YesNoRadio
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil}.vorGeburt`}
          errors={errors}
          required
        />
      </FormFieldGroup>
      {wasErwerbstaetig === YesNo.YES && (
        <>
          <ErwerbstaetigkeitCheckboxGroup elternteil={elternteil} />
          {!!isNichtSelbststaendig && !isSelbststaendig && (
            <>
              <FormFieldGroup description="Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?">
                <YesNoRadio
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name={`${elternteil}.mehrereTaetigkeiten`}
                  errors={errors}
                  required
                />
              </FormFieldGroup>
              {mehrereTaetigkeiten === YesNo.NO && (
                <>
                  <FormFieldGroup description="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes sozialversicherungspflichtig?">
                    <YesNoRadio
                      register={register}
                      registerOptions={{
                        required: "Dieses Feld ist erforderlich",
                      }}
                      name={`${elternteil}.sozialVersicherungsPflichtig`}
                      errors={errors}
                      required
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    description="Hatten Sie Einkommen aus einem Mini-Job?"
                    info={infoTexts.minijobsMaxZahl}
                  >
                    <CustomRadioGroup
                      register={register}
                      registerOptions={{
                        required: "Dieses Feld ist erforderlich",
                      }}
                      name={`${elternteil}.monatlichesBrutto`}
                      errors={errors}
                      options={monatlichesBruttoOptions}
                      required
                    />
                  </FormFieldGroup>
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
