import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import { InfoZuAVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuAVPflicht";
import { InfoZuKVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuKVPflicht";
import { InfoZuRVPflicht } from "@/application/features/abfrage-prototyp/components/InfoZuRVPflicht";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import { berechneExaktenBemessungszeitraum } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import {
  CustomSelect,
  SelectOption,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import { YesNo } from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Steuerklasse } from "@/elterngeldrechner";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly incomeIndex: number;
};

export function DetailsAngestelltForm({
  id,
  onSubmit,
  elternteil,
  incomeIndex,
}: Props) {
  const store = useAppStore();

  const { handleSubmit, register, formState } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAngabenEinkommen = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const taetigkeitenET1 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET1,
  );
  const taetigkeitenET2 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET2,
  );
  const taetigkeit =
    elternteil === Elternteil.Eins
      ? taetigkeitenET1[incomeIndex]
      : taetigkeitenET2[incomeIndex];

  const ausklammerungenET1 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET1,
  );
  const ausklammerungenET2 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET2,
  );
  const ausklammerungen =
    elternteil === Elternteil.Eins ? ausklammerungenET1 : ausklammerungenET2;

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const flowForBMZ =
    taetigkeit?.taetigkeitenArt === "selbststaendig"
      ? PersonPageFlow.selbststaendig
      : PersonPageFlow.nichtSelbststaendig;
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flowForBMZ,
    ausklammerungen,
  );

  const isDurchschnittseinkommenOptions: CustomRadioGroupOption<YesNo>[] = [
    { value: YesNo.YES, label: "Ich habe jeden Monat gleich viel verdient" },
    { value: YesNo.NO, label: "Ich habe unterschiedlich viel verdient" },
  ];

  const steuerklasseOptions: SelectOption<Steuerklasse | "">[] = [
    { value: Steuerklasse.I, label: "1" },
    { value: Steuerklasse.II, label: "2" },
    { value: Steuerklasse.III, label: "3" },
    { value: Steuerklasse.IV, label: "4" },
    { value: Steuerklasse.V, label: "5" },
  ];

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        <div className="my-40 inline-block rounded bg-grey-light py-10">
          <span className="px-20 font-bold">
            Bemessungszeitraum: {maximalerBemessungszeitraum}
          </span>
        </div>
        <h3 className="mb-40">Details zur angestellten Tätigkeit</h3>

        {taetigkeit?.isMinijob === YesNo.NO && (
          <div>
            <h5 className="mb-20">Welche Steuerklasse hatten Sie?</h5>
            <CustomSelect
              className="mb-32"
              autoWidth
              register={register}
              registerOptions={{
                required: "Eine Option muss ausgewählt sein",
              }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.steuerklasse`}
              label="Steuerklasse"
              errors={formState.errors}
              options={steuerklasseOptions}
              customPlaceholder="Steuerklasse auswählen"
              required
            />

            <h5 className="mb-8">Sind Sie kirchensteuerpflichtig?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.zahlenSieKirchenSteuer`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Sind Sie über die gesetzliche Krankenversicherung
              pflichtversichert?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuKVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigKVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche Rentenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuRVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigRVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche
              Arbeitslosenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuAVPflicht />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.selbststaendigAVPflichtversichert`}
              errors={formState.errors}
            />
          </div>
        )}

        <div>
          <h5 className="mb-8">
            Wie haben Sie von {maximalerBemessungszeitraum} im Monat brutto
            verdient?
          </h5>
          <CustomRadioGroup
            className="mb-32"
            legend=""
            options={isDurchschnittseinkommenOptions}
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.isDurchschnittseinkommen`}
            errors={formState.errors}
          />
        </div>
      </div>
    </form>
  );
}
