import type { ElternteilType } from "@/monatsplaner";
import {
  CustomRadio,
  FormFieldGroup,
  RadioOption,
  YesNoRadio,
} from "@/components/molecules";
import { useFormContext } from "react-hook-form";
import {
  MonatlichesBrutto,
  StepErwerbstaetigkeitState,
  initialStepErwerbstaetigkeitElternteil,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { VFC, useEffect } from "react";
import { YesNo } from "@/globals/js/calculations/model";
import { ErwerbstaetigkeitCheckboxGroup } from "./ErwerbstaetigkeitCheckboxGroup";
import { infoTexts } from "@/components/molecules/info-dialog";
import { Antragstellende } from "@/redux/stepAllgemeineAngabenSlice";

const monatlichesBruttoLabels: { [K in MonatlichesBrutto]: string } = {
  MiniJob: "520 Euro oder weniger",
  MehrAlsMiniJob: "mehr als 520 Euro",
};

const monatlichesBruttoOptions: RadioOption<MonatlichesBrutto>[] = [
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
  elternteil: ElternteilType;
  elternteilName: string;
  antragssteller: Antragstellende | null;
}

const ErwerbstaetigkeitFormElternteil: VFC<
  ErwerbstaetikeitFormElternteilProps
> = ({ elternteil, elternteilName, antragssteller }) => {
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
    <>
      <FormFieldGroup
        headline={antragssteller === "FuerBeide" ? elternteilName : ""}
        description="Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes erwerbstätig?"
      >
        <YesNoRadio
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil}.vorGeburt`}
          errors={errors}
          required={true}
        />
      </FormFieldGroup>
      {wasErwerbstaetig === YesNo.YES && (
        <>
          <ErwerbstaetigkeitCheckboxGroup elternteil={elternteil} />
          {isNichtSelbststaendig && !isSelbststaendig && (
            <>
              <FormFieldGroup description="Bestand Ihre nichtselbständige Arbeit aus mehreren Tätigkeiten?">
                <YesNoRadio
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name={`${elternteil}.mehrereTaetigkeiten`}
                  errors={errors}
                  required={true}
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
                      required={true}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    description="Wie hoch war Ihr monatliches Brutto-Einkommen?"
                    info={infoTexts.minijobsMaxZahl}
                  >
                    <CustomRadio
                      register={register}
                      registerOptions={{
                        required: "Dieses Feld ist erforderlich",
                      }}
                      name={`${elternteil}.monatlichesBrutto`}
                      errors={errors}
                      options={monatlichesBruttoOptions}
                      required={true}
                    />
                  </FormFieldGroup>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ErwerbstaetigkeitFormElternteil;
