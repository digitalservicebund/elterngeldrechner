import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import {
  Ausklammerung,
  berechneExaktenBemessungszeitraum,
  erstelleExakteZeitabschnitteBemessungszeitraum,
  ZeitabschnittArt,
} from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";
import {
  CustomNumberField,
  CustomSelect,
  InfoZuMiniJobs,
  SelectOption,
  YesNoRadio,
} from "../../abfrageteil/components/common";
import { Antragstellende, YesNo } from "../../abfrageteil/state";
import { CustomRadioGroup } from "@/application/components";
import { EinkommenAngabenStep } from "@/application/pages/abfrage-protoyp/PersonPage";
import { InfoZuKVPflicht } from "./InfoZuKVPflicht";
import { InfoZuRVPflicht } from "./InfoZuRVPflicht";
import { InfoZuAVPflicht } from "./InfoZuAVPflicht";
import { InfoZuBruttoGewinn } from "./InfoZuBruttoGewinn";
import ToggleOff from "@digitalservicebund/icons/ToggleOff";
import ToggleOn from "@digitalservicebund/icons/ToggleOn";
import { Steuerklasse } from "@/elterngeldrechner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
    hasWeitereTaetigkeiten?: YesNo | null,
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  // readonly hasAusklammerungsgrund: boolean;
  readonly auszuklammerndeZeitraeume?: Ausklammerung[];
  readonly einkommenAngabenStep: EinkommenAngabenStep;
};

export function EinkommenAngabenForm({
  id,
  onSubmit,
  flow,
  auszuklammerndeZeitraeume,
  einkommenAngabenStep,
  elternteil,
}: Props) {
  const store = useAppStore();

  const { control, handleSubmit, register, formState, watch, getValues } =
    useForm({
      defaultValues: store.getState().stepPrototyp,
    });

  const submitAngabenEinkommen = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
    auszuklammerndeZeitraeume ?? [],
  );
  const exakteZeitabschnitteBemessungszeitraum =
    erstelleExakteZeitabschnitteBemessungszeitraum(
      geburtsdatumDesKindes,
      flow ?? PersonPageFlow.noFlow,
      auszuklammerndeZeitraeume ?? [],
    );

  const isMinijob = watch(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.isMinijob`,
  );

  const [isMinijobToggled, setIsMinijobToggled] = useState<boolean>(false);
  const [isRegularJobToggled, setIsRegularJobToggled] =
    useState<boolean>(false);

  const steuerklasseOptions: SelectOption<Steuerklasse | "">[] = [
    { value: Steuerklasse.I, label: "1" },
    { value: Steuerklasse.II, label: "2" },
    { value: Steuerklasse.III, label: "3" },
    { value: Steuerklasse.IV, label: "4" },
    { value: Steuerklasse.V, label: "5" },
  ];

  const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from(
    { length: 12 },
    (_, index) => ({
      label: `${index + 1}. Monat`,
      value: `${index + 1}`,
    }),
  );

  const monthsBeforeBirth: SelectOption[] = MONTHS_BEFORE_BIRTH_OPTIONS;

  const formattedDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        {einkommenAngabenStep.taetigkeitArt === "selbststaendig" && (
          <div>
            <h3>Einkommen aus selbstständiger Arbeit</h3>
            <div className="mt-20 mb-40 rounded bg-grey-light inline-block py-10">
              <span className="font-bold px-20">
                Bemessungszeitraum: {maximalerBemessungszeitraum}
              </span>
            </div>

            <h5 className="mb-8">Sind Sie kirchensteuerpflichtig?</h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.zahlenSieKirchenSteuer`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Sind Sie über die gesetzliche Krankenversicherung
              pflichtversichert?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuKVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigKVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche Rentenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuRVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigRVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8">
              Zahlen Sie Pflichtbeiträge in die gesetzliche
              Arbeitslosenversicherung?
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuAVPflicht selbststaendig />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigAVPflichtversichert`}
              errors={formState.errors}
            />

            <h5 className="mb-8 mt-40">
              Wie viel haben Sie im Bemessungszeitraum brutto im Kalenderjahr
              verdient?
            </h5>
            <CustomNumberField
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoJahresgewinn`}
              label="Brutto-Gewinn im Kalenderjahr"
              slotBeforeLabel={<InfoZuBruttoGewinn selbststaendig />}
              suffix="Euro"
              control={control}
            />
          </div>
        )}

        {einkommenAngabenStep.taetigkeitArt === "nichtSelbststaendig" && (
          <div>
            <h3>Einkommen aus nicht-selbstständiger Arbeit</h3>

            <div className="mt-20 mb-40 rounded bg-grey-light inline-block py-10">
              <span className="font-bold px-20">
                Bemessungszeitraum: {maximalerBemessungszeitraum}
              </span>
            </div>

            <h5 className="mb-8">
              Handelt es sich um Einkommen aus einem Minijob?{" "}
            </h5>
            <YesNoRadio
              className="mb-32"
              legend=""
              slotBetweenLegendAndOptions={<InfoZuMiniJobs />}
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.isMinijob`}
              errors={formState.errors}
            />

            {isMinijob === YesNo.YES && (
              <div>
                <h5 className="mb-8 mt-40">
                  Wie viel haben Sie im Bemessungszeitraum durchschnittlich im
                  Monat brutto verdient?
                </h5>
                <p className="mt-20">
                  Wenn Ihr Einkommen über diesen Zeitraum schwankte, geben Sie
                  Ihr Einkommen pro Monat ein.
                </p>
                <div
                  className="my-20 mb-32 cursor-pointer"
                  onClick={() => setIsMinijobToggled(!isMinijobToggled)}
                >
                  {!isMinijobToggled ? <ToggleOff /> : <ToggleOn />}
                  <span className="pl-8">Durchschnittswert oder Monat</span>
                </div>
                {!isMinijobToggled ? (
                  <CustomNumberField
                    name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoMonatsschnitt`}
                    label="Durschnittliches Brutto-Einkommen pro Monat"
                    suffix="Euro"
                    control={control}
                  />
                ) : (
                  <>
                    {exakteZeitabschnitteBemessungszeitraum!.map(
                      ({ art, zeitabschnitt }, index) =>
                        art === ZeitabschnittArt.ausklammerung ? (
                          <section
                            key={index}
                            className="rounded border-dashed p-16 my-32"
                            aria-live="polite"
                            aria-labelledby="bmz"
                          >
                            <div className="pl-32">
                              <h4 className="italic">
                                Übersprungener Zeitraum:
                              </h4>
                              <p key={zeitabschnitt.beschreibung}>
                                {zeitabschnitt.beschreibung}{" "}
                                {formattedDate(zeitabschnitt.von)} bis{" "}
                                {formattedDate(zeitabschnitt.bis)}
                              </p>
                            </div>
                          </section>
                        ) : (
                          <div key={index} className="bg-off-white p-40 pt-32">
                            <div className="pl-8">
                              <strong>{zeitabschnitt.beschreibung}</strong>
                              {zeitabschnitt.monate.map(
                                ({ monatsIndex, monatsName }) => (
                                  <CustomNumberField
                                    className="mt-10"
                                    control={control}
                                    name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoMonatsangaben.${monatsIndex}`}
                                    label={`${monatsName} Brutto-Einkommen`}
                                    suffix="Euro"
                                    required
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        ),
                    )}
                  </>
                )}
              </div>
            )}

            {isMinijob === YesNo.NO && (
              <div>
                <h5 className="mb-20">Welche Steuerklasse hatten Sie?</h5>
                <CustomSelect
                  className="mb-32"
                  autoWidth
                  register={register}
                  registerOptions={{
                    required: "Eine Option muss ausgewählt sein",
                  }}
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.steuerklasse`}
                  label="Steuerklasse"
                  errors={formState.errors}
                  options={steuerklasseOptions}
                  required
                />

                <h5 className="mb-8">Sind Sie kirchensteuerpflichtig?</h5>
                <YesNoRadio
                  className="mb-32"
                  legend=""
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.zahlenSieKirchenSteuer`}
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
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigKVPflichtversichert`}
                  errors={formState.errors}
                />

                <h5 className="mb-8">
                  Zahlen Sie Pflichtbeiträge in die gesetzliche
                  Rentenversicherung?
                </h5>
                <YesNoRadio
                  className="mb-32"
                  legend=""
                  slotBetweenLegendAndOptions={<InfoZuRVPflicht />}
                  register={register}
                  registerOptions={{ required: "Dieses Feld ist erforderlich" }}
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigRVPflichtversichert`}
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
                  name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.selbststaendigAVPflichtversichert`}
                  errors={formState.errors}
                />

                <h5 className="mb-8 mt-40 mb-20">
                  Wie viel haben Sie im Bemessungszeitraum durchschnittlich im
                  Monat brutto verdient?
                </h5>
                <InfoZuBruttoGewinn />
                <p className="mt-20">
                  Wenn Ihr Einkommen über diesen Zeitraum schwankte, geben Sie
                  Ihr Einkommen pro Monat ein.
                </p>
                <div
                  className="my-20 mb-32 cursor-pointer"
                  onClick={() => setIsRegularJobToggled(!isRegularJobToggled)}
                >
                  {!isRegularJobToggled ? <ToggleOff /> : <ToggleOn />}
                  <span className="pl-8">Durchschnittswert oder Monat</span>
                </div>
                {!isRegularJobToggled ? (
                  <CustomNumberField
                    name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoMonatsschnitt`}
                    label="Durschnittliches Brutto-Einkommen pro Monat"
                    suffix="Euro"
                    control={control}
                  />
                ) : (
                  <>
                    {exakteZeitabschnitteBemessungszeitraum!.map(
                      ({ art, zeitabschnitt }, index) =>
                        art === ZeitabschnittArt.ausklammerung ? (
                          <section
                            key={index}
                            className="rounded border-dashed p-16 my-32"
                            aria-live="polite"
                            aria-labelledby="bmz"
                          >
                            <div className="pl-32">
                              <h4 className="italic">
                                Übersprungener Zeitraum:
                              </h4>
                              <p key={zeitabschnitt.beschreibung}>
                                {zeitabschnitt.beschreibung}{" "}
                                {formattedDate(zeitabschnitt.von)} bis{" "}
                                {formattedDate(zeitabschnitt.bis)}
                              </p>
                            </div>
                          </section>
                        ) : (
                          <div key={index} className="bg-off-white p-40 pt-32">
                            <div className="pl-8">
                              <strong>{zeitabschnitt.beschreibung}</strong>
                              {zeitabschnitt.monate.map(
                                ({ monatsIndex, monatsName }) => (
                                  <CustomNumberField
                                    className="mt-10"
                                    control={control}
                                    name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${einkommenAngabenStep.taetigkeitIndex}.bruttoMonatsangaben.${monatsIndex}`}
                                    label={`${monatsName} Brutto-Einkommen`}
                                    suffix="Euro"
                                    required
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        ),
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
