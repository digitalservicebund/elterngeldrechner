import { useCallback } from "react";
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
  berechneUngefaehrenBemessungszeitraum,
} from "./berechneBemessungszeitraum";
import { PersonPageFlow } from "./PersonPageRouting";
import { CustomDate } from "../../abfrageteil/components/NachwuchsForm/CustomDate";
import { parseGermanDateString } from "../state/stepPrototypSlice";
import { Antragstellende } from "../../abfrageteil/state";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    antragsstellende?: Antragstellende,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  // readonly hasAusklammerungsgrund: boolean;
};

export function AusklammerungsZeitenForm({
  id,
  onSubmit,
  flow,
  elternteil,
}: Props) {
  const store = useAppStore();

  const stepState = store.getState().stepPrototyp;

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );

  const berechneterMutterschutzBeginn = (geburtsdatum: Date): Date => {
    const date = new Date(geburtsdatum);
    return new Date(date.setDate(date.getDate() - 42));
  };

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...stepState,
      ET1: {
        ...stepState.ET1,
        mutterschutzDiesesKindVon:
          stepState.ET1.mutterschutzAnderesKindVon.length === 0 &&
          stepState.ET1.hasMutterschutzDiesesKind
            ? berechneterMutterschutzBeginn(
                geburtsdatumDesKindes,
              ).toLocaleDateString("de-DE")
            : "",
        mutterschutzDiesesKindBis:
          stepState.ET1.mutterschutzAnderesKindVon.length === 0 &&
          stepState.ET1.hasMutterschutzDiesesKind
            ? geburtsdatumDesKindes.toLocaleDateString("de-DE")
            : "",
      },
      ET2: {
        ...stepState.ET2,
        mutterschutzDiesesKindVon:
          stepState.ET2.mutterschutzAnderesKindVon.length === 0 &&
          stepState.ET2.hasMutterschutzDiesesKind
            ? berechneterMutterschutzBeginn(
                geburtsdatumDesKindes,
              ).toLocaleDateString("de-DE")
            : "",
        mutterschutzDiesesKindBis:
          stepState.ET2.mutterschutzAnderesKindVon.length === 0 &&
          stepState.ET2.hasMutterschutzDiesesKind
            ? geburtsdatumDesKindes.toLocaleDateString("de-DE")
            : "",
      },
    },
  });

  const submitAusklammerungsZeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, undefined, undefined, undefined, ausklammerungen());
    },
    [store, onSubmit],
  );

  const ungefährerBemessungszeitraum = berechneUngefaehrenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
  );

  const hasMutterschutzDiesesKind = getValues(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasMutterschutzDiesesKind`,
  );
  const mutterschutzDiesesKindVon = watch(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindVon`,
  );
  const mutterschutzDiesesKindBis = watch(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindBis`,
  );

  const hasMutterschutzAnderesKind = getValues(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasMutterschutzAnderesKind`,
  );
  const hasElterngeldAnderesKind = getValues(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasElterngeldAnderesKind`,
  );
  const hasErkrankung = getValues(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.hasErkrankung`,
  );
  const isBeamtet = getValues(
    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.isBeamtet`,
  );

  const ausklammerungen = (): Ausklammerung[] => {
    const ausklammerungen: Ausklammerung[] = [];

    if (
      mutterschutzDiesesKindVon.length > 0 &&
      mutterschutzDiesesKindBis.length > 0 &&
      !isBeamtet
    ) {
      const mutterschutz: Ausklammerung = {
        beschreibung: "Mutterschutz für dieses Kind",
        von: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindVon`,
          ),
        ),
        bis: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindBis`,
          ),
        ),
      };
      ausklammerungen.push(mutterschutz);
    }

    if (
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldVon`,
      ) &&
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldBis`,
      )
    ) {
      const elterngeld: Ausklammerung = {
        beschreibung: "Elterngeld für älteres Kind",
        von: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldVon`,
          ),
        ),
        bis: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldBis`,
          ),
        ),
      };
      ausklammerungen.push(elterngeld);
    }

    if (
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindVon`,
      ) &&
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindBis`,
      )
    ) {
      const mutterschutzAnderesKind: Ausklammerung = {
        beschreibung: "Mutterschutz für älteres Kind",
        von: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindVon`,
          ),
        ),
        bis: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindBis`,
          ),
        ),
      };
      ausklammerungen.push(mutterschutzAnderesKind);
    }

    if (
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitVon`,
      ) &&
      getValues(
        `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitBis`,
      )
    ) {
      const erkrankung: Ausklammerung = {
        beschreibung: "Mutterschutz für älteres Kind",
        von: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitVon`,
          ),
        ),
        bis: parseGermanDateString(
          getValues(
            `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitBis`,
          ),
        ),
      };
      ausklammerungen.push(erkrankung);
    }

    return ausklammerungen;
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit(submitAusklammerungsZeiten)}
      noValidate
    >
      <h3 className="mb-16">
        Bitte machen Sie Detailangaben für den Zeitraum:
        <ul className="list list-disc ml-40">
          <li>{ungefährerBemessungszeitraum}</li>
        </ul>
      </h3>

      {hasMutterschutzDiesesKind && (
        <section className="mt-32">
          <h5>Von wann bis wann waren oder werden Sie im Mutterschutz sein?</h5>
          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label className="mt-20 block text-16">
                Beginn des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.mutterschutzDiesesKindVon?.message
                    : errors.ET2?.mutterschutzDiesesKindVon?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindVon`,
                  {
                    required: "Dieses Feld ist erforderlich",
                  },
                )}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">
                Ende des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.mutterschutzDiesesKindBis?.message
                    : errors.ET2?.mutterschutzDiesesKindBis?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzDiesesKindBis`,
                  {
                    required: "Dieses Feld ist erforderlich",
                  },
                )}
              />
            </div>
          </div>
        </section>
      )}

      {hasMutterschutzAnderesKind && (
        <section className="mt-32">
          <h5>
            Von wann bis wann waren Sie im Mutterschutz für ein älteres Kind?
          </h5>
          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label className="mt-20 block text-16">
                Beginn des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.mutterschutzAnderesKindVon?.message
                    : errors.ET2?.mutterschutzAnderesKindVon?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindVon`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">
                Ende des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.mutterschutzAnderesKindBis?.message
                    : errors.ET2?.mutterschutzAnderesKindBis?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.mutterschutzAnderesKindBis`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
          </div>
        </section>
      )}

      {hasElterngeldAnderesKind && (
        <section className="mt-32">
          <h5>
            Von wann bis wann haben Sie Elterngeld für ein älteres Kind (maximal
            14 Monate alt) bekommen?
          </h5>
          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label className="mt-20 block text-16">Beginn</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.elterngeldVon?.message
                    : errors.ET2?.elterngeldVon?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldVon`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">Ende</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.elterngeldBis?.message
                    : errors.ET2?.elterngeldBis?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.elterngeldBis`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
          </div>
        </section>
      )}

      {hasErkrankung && (
        <section className="mt-32">
          <h5>
            Von wann bis wann waren Sie wegen Ihrer Schwangerschaft krank?
          </h5>
          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label className="mt-20 block text-16">Beginn</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.krankheitVon?.message
                    : errors.ET2?.krankheitVon?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitVon`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">Ende</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={
                  elternteil === Elternteil.Eins
                    ? errors.ET1?.krankheitBis?.message
                    : errors.ET2?.krankheitBis?.message
                }
                {...register(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.krankheitBis`,
                  {
                    required: "Dieses Feld ist erforderlich",
                    pattern: {
                      value: /^\d{2}\.\d{2}\.\d{4}$/,
                      message: "Bitte das Feld vollständig ausfüllen",
                    },
                  },
                )}
              />
            </div>
          </div>
        </section>
      )}
    </form>
  );
}
