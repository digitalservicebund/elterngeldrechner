import { useFormContext } from "react-hook-form";
import type { ElternteilType } from "@/monatsplaner";
import {
  CustomRadio,
  CustomSelect,
  FormFieldGroup,
  RadioOption,
  SelectOption,
  YesNoRadio,
} from "@/components/molecules";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";
import { infoTexts } from "@/components/molecules/info-dialog";
import { useAppSelector } from "@/redux/hooks";
import { stepErwerbstaetigkeitElternteilSelectors } from "@/redux/stepErwerbstaetigkeitSlice";

interface SteuerUndVersicherungProps {
  readonly elternteil: ElternteilType;
  readonly isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten: boolean;
}

const steuerKlasseOptions: SelectOption<SteuerKlasse | "">[] = [
  { value: SteuerKlasse.SKL1, label: "1" },
  { value: SteuerKlasse.SKL2, label: "2" },
  { value: SteuerKlasse.SKL3, label: "3" },
  { value: SteuerKlasse.SKL4, label: "4" },
  { value: SteuerKlasse.SKL5, label: "5" },
];

const kinderFreiBetragOptions: SelectOption<KinderFreiBetrag | "">[] = [
  { value: KinderFreiBetrag.ZKF0, label: "0" },
  { value: KinderFreiBetrag.ZKF0_5, label: "0,5" },
  { value: KinderFreiBetrag.ZKF1, label: "1,0" },
  { value: KinderFreiBetrag.ZKF1_5, label: "1,5" },
  { value: KinderFreiBetrag.ZKF2, label: "2,0" },
  { value: KinderFreiBetrag.ZKF2_5, label: "2,5" },
  { value: KinderFreiBetrag.ZKF3, label: "3,0" },
  { value: KinderFreiBetrag.ZKF3_5, label: "3,5" },
  { value: KinderFreiBetrag.ZKF4, label: "4,0" },
  { value: KinderFreiBetrag.ZKF4_5, label: "4,5" },
  { value: KinderFreiBetrag.ZKF5, label: "5,0" },
];

const kassenArtLabels: { [K in KassenArt]: string } = {
  [KassenArt.GESETZLICH_PFLICHTVERSICHERT]: "gesetzlich pflichtversichert",
  [KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT]:
    "nicht gesetzlich pflichtversichert",
};

const kassenArtOptions: RadioOption<KassenArt>[] = [
  {
    value: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    label: kassenArtLabels.GESETZLICH_PFLICHTVERSICHERT,
  },
  {
    value: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    label: kassenArtLabels.NICHT_GESETZLICH_PFLICHTVERSICHERT,
  },
];

const rentenVersicherungLabels: { [K in RentenArt]: string } = {
  [RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG]: "gesetzliche Rentenversicherung",
  [RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG]:
    "keine gesetzliche Rentenversicherung",
};

const rentenVersicherungOptions: RadioOption<RentenArt>[] = [
  {
    value: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    label: rentenVersicherungLabels.GESETZLICHE_RENTEN_VERSICHERUNG,
  },
  {
    value: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    label: rentenVersicherungLabels.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
  },
];

export function SteuerUndVersicherung({
  elternteil,
  isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten,
}: SteuerUndVersicherungProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<StepEinkommenState>();

  const numberOfGeschwisterKinder = useAppSelector(
    (state) => state.stepNachwuchs.geschwisterkinder.length,
  );

  const isOnlySelbstaendig = useAppSelector((state) =>
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      state.stepErwerbstaetigkeit[elternteil],
    ),
  );

  return (
    <>
      {!isOnlySelbstaendig && (
        <FormFieldGroup headline="Steuerklasse">
          <CustomSelect
            autoWidth
            register={register}
            registerOptions={{
              required: "Eine Option muss ausgewählt sein",
            }}
            name={`${elternteil}.steuerKlasse`}
            label="Welche Steuerklasse haben Sie?"
            errors={errors}
            options={steuerKlasseOptions}
            required
            info={infoTexts.einkommenSteuerklasse}
          />
        </FormFieldGroup>
      )}
      {!isOnlySelbstaendig && numberOfGeschwisterKinder > 0 && (
        <FormFieldGroup headline="Kinderfreibeträge">
          <CustomSelect
            autoWidth
            register={register}
            registerOptions={{
              required: "Eine Option muss ausgewählt sein",
            }}
            name={`${elternteil}.kinderFreiBetrag`}
            label="Wie viele Kinderfreibeträge sind aus Ihrer Lohn- und
        Gehaltsbescheinigung ersichtlich?"
            errors={errors}
            options={kinderFreiBetragOptions}
            required
          />
        </FormFieldGroup>
      )}
      <FormFieldGroup
        headline="Kirchensteuer"
        description="Sind Sie kirchensteuerpflichtig?"
      >
        <YesNoRadio
          register={register}
          registerOptions={{
            required: "Dieses Feld ist erforderlich",
          }}
          name={`${elternteil}.zahlenSieKirchenSteuer`}
          errors={errors}
          required
        />
      </FormFieldGroup>
      {!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
        <FormFieldGroup
          headline="Krankenversicherung"
          description="Wie sind Sie krankenversichert?"
        >
          <CustomRadio
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            name={`${elternteil}.kassenArt`}
            options={kassenArtOptions}
            errors={errors}
            required
          />
        </FormFieldGroup>
      )}
      {!!isOnlySelbstaendig && (
        <FormFieldGroup
          headline="Rentenversicherung"
          description="Wie sind Sie rentenversichert?"
        >
          <CustomRadio
            register={register}
            registerOptions={{
              required: "Dieses Feld ist erforderlich",
            }}
            name={`${elternteil}.rentenVersicherung`}
            options={rentenVersicherungOptions}
            errors={errors}
            required
          />
        </FormFieldGroup>
      )}
    </>
  );
}
