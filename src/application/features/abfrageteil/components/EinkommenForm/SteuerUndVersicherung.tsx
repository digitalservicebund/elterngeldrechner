import { useFormContext } from "react-hook-form";
import { InfoZurGesetzlichenKrankenversicherung } from "./InfoZurGesetzlichenKrankenversicherung";
import { InfoZurSteuerklasse } from "./InfoZurSteuerklasse";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import {
  CustomSelect,
  type SelectOption,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  type ElternteilType,
  type StepEinkommenState,
  stepErwerbstaetigkeitElternteilSelectors,
} from "@/application/features/abfrageteil/state";
import { useAppSelector } from "@/application/redux/hooks";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner";

type Props = {
  readonly elternteil: ElternteilType;
  readonly isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten: boolean;
};

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

const kassenArtOptions: CustomRadioGroupOption<KassenArt>[] = [
  {
    value: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    label: "Ja",
  },
  {
    value: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    label: "Nein",
  },
];

const rentenVersicherungOptions: CustomRadioGroupOption<RentenArt>[] = [
  {
    value: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    label: "gesetzliche Rentenversicherung",
  },
  {
    value: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    label: "keine gesetzliche Rentenversicherung",
  },
];

export function SteuerUndVersicherung({
  elternteil,
  isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten,
}: Props) {
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
        <CustomSelect
          autoWidth
          register={register}
          registerOptions={{
            required: "Eine Option muss ausgewählt sein",
          }}
          name={`${elternteil}.steuerKlasse`}
          label="Welche Steuerklasse hatten Sie in den letzten 12 Monaten?"
          errors={errors}
          options={steuerKlasseOptions}
          required
          slotBetweenLabelAndSelect={<InfoZurSteuerklasse />}
        />
      )}

      {!isOnlySelbstaendig && numberOfGeschwisterKinder > 0 && (
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
      )}

      <YesNoRadio
        legend="Sind Sie kirchensteuerpflichtig?"
        register={register}
        registerOptions={{ required: "Dieses Feld ist erforderlich" }}
        name={`${elternteil}.zahlenSieKirchenSteuer`}
        errors={errors}
        required
      />

      {!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
        <CustomRadioGroup
          legend="Sind Sie gesetzlich pflichtversichert?"
          slotBetweenLegendAndOptions={
            <InfoZurGesetzlichenKrankenversicherung />
          }
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil}.kassenArt`}
          options={kassenArtOptions}
          errors={errors}
          required
        />
      )}
      {!!isOnlySelbstaendig && (
        <CustomRadioGroup
          legend="Wie sind Sie rentenversichert?"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil}.rentenVersicherung`}
          options={rentenVersicherungOptions}
          errors={errors}
          required
        />
      )}
    </>
  );
}
