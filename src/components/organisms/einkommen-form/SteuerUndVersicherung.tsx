import { useId } from "react";
import { useFormContext } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/components/molecules";
import {
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";
import type { ElternteilType } from "@/redux/elternteil-type";
import { useAppSelector } from "@/redux/hooks";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
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

const kassenArtOptions: CustomRadioGroupOption<KassenArt>[] = [
  {
    value: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    label: "gesetzlich pflichtversichert",
  },
  {
    value: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    label: "privat pflichtversichert",
  },
  {
    value: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    label: "freiwillig gesetzlich versichert",
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

const einkommenSteuerklasseInfo =
  "Das Faktorverfahren in der Steuerklassenkombination IV/IV wird in der vorliegenden Berechnung nicht berücksichtigt. Der Standardwert 1,0 ist festgelegt. Sollte Ihr Faktor kleiner als 1,0 sein, wirkt sich dies entsprechend auf die Höhe des Elterngeldes aus. Sie erhalten dann mehr Elterngeld (im unteren zweistelligen Bereich)";

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

  const steuerklasseHeadingIdentifier = useId();
  const kinderfreibetraegeHeadingIdentifier = useId();
  const kirchensteuerHeadingIdentifier = useId();
  const krankenversicherungHeadingIdentifier = useId();
  const rentenversicherungHeadingIdentifier = useId();
  return (
    <>
      {!isOnlySelbstaendig && (
        <section aria-labelledby={steuerklasseHeadingIdentifier}>
          <h3 id={steuerklasseHeadingIdentifier} className="mb-10">
            Steuerklasse
          </h3>

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
            info={einkommenSteuerklasseInfo}
          />
        </section>
      )}
      {!isOnlySelbstaendig && numberOfGeschwisterKinder > 0 && (
        <section aria-labelledby={kinderfreibetraegeHeadingIdentifier}>
          <h3 id={kinderfreibetraegeHeadingIdentifier} className="mb-10">
            Kinderfreibeträge
          </h3>

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
        </section>
      )}

      <section aria-labelledby={kirchensteuerHeadingIdentifier}>
        <h3 id={kirchensteuerHeadingIdentifier} className="mb-10">
          Kirchensteuer
        </h3>

        <YesNoRadio
          legend="Sind Sie kirchensteuerpflichtig?"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil}.zahlenSieKirchenSteuer`}
          errors={errors}
          required
        />
      </section>

      {!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
        <section aria-labelledby={krankenversicherungHeadingIdentifier}>
          <h3 id={krankenversicherungHeadingIdentifier} className="mb-10">
            Krankenversicherung
          </h3>

          <CustomRadioGroup
            legend="Wie sind Sie krankenversichert?"
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name={`${elternteil}.kassenArt`}
            options={kassenArtOptions}
            errors={errors}
            required
          />
        </section>
      )}
      {!!isOnlySelbstaendig && (
        <section aria-labelledby={rentenversicherungHeadingIdentifier}>
          <h3 id={rentenversicherungHeadingIdentifier} className="mb-10">
            Rentenversicherung
          </h3>

          <CustomRadioGroup
            legend="Wie sind Sie rentenversichert?"
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name={`${elternteil}.rentenVersicherung`}
            options={rentenVersicherungOptions}
            errors={errors}
            required
          />
        </section>
      )}
    </>
  );
}
