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
import { Button } from "@/application/components";
import RedoIcon from "@digitalservicebund/icons/Redo";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (
    values: StepPrototypState,
    flow?: PersonPageFlow,
    hasAusklammerungsgrund?: boolean,
    auszuklammerndeZeitraeume?: Ausklammerung[],
  ) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  readonly hasAusklammerungsgrund: boolean;
};

export function AusklammerungsZeitenForm({
  id,
  onSubmit,
  flow,
  hasAusklammerungsgrund,
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
      mutterschutzDiesesKindVon: stepState.hasMutterschutzDiesesKind
        ? berechneterMutterschutzBeginn(
            geburtsdatumDesKindes,
          ).toLocaleDateString("de-DE")
        : "",
      mutterschutzDiesesKindBis: stepState.hasMutterschutzDiesesKind
        ? geburtsdatumDesKindes.toLocaleDateString("de-DE")
        : "",
    },
  });

  const submitAusklammerungsZeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, undefined, hasAusklammerungsgrund, ausklammerungen());
    },
    [store, onSubmit],
  );

  const ungefährerBemessungszeitraum = berechneUngefaehrenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
  );

  const hasMutterschutzDiesesKind = getValues("hasMutterschutzDiesesKind");
  const mutterschutzDiesesKindVon = watch("mutterschutzDiesesKindVon");
  const mutterschutzDiesesKindBis = watch("mutterschutzDiesesKindBis");

  const hasMutterschutzAnderesKind = getValues("hasMutterschutzAnderesKind");
  const hasElterngeldAnderesKind = getValues("hasElterngeldAnderesKind");
  const hasErkrankung = getValues("hasErkrankung");
  const isBeamtet = getValues("isBeamtet");

  const ausklammerungen = (): Ausklammerung[] => {
    const ausklammerungen: Ausklammerung[] = [];

    if (
      mutterschutzDiesesKindVon.length > 0 &&
      mutterschutzDiesesKindBis.length > 0 &&
      !isBeamtet
    ) {
      const mutterschutz: Ausklammerung = {
        beschreibung: "Mutterschutz für dieses Kind",
        von: parseGermanDateString(getValues("mutterschutzDiesesKindVon")),
        bis: parseGermanDateString(getValues("mutterschutzDiesesKindBis")),
      };
      ausklammerungen.push(mutterschutz);
    }

    if (getValues("elterngeldVon") && getValues("elterngeldBis")) {
      const elterngeld: Ausklammerung = {
        beschreibung: "Elterngeld für älteres Kind",
        von: parseGermanDateString(getValues("elterngeldVon")),
        bis: parseGermanDateString(getValues("elterngeldBis")),
      };
      ausklammerungen.push(elterngeld);
    }

    if (
      getValues("mutterschutzAnderesKindVon") &&
      getValues("mutterschutzAnderesKindBis")
    ) {
      const mutterschutzAnderesKind: Ausklammerung = {
        beschreibung: "Mutterschutz für älteres Kind",
        von: parseGermanDateString(getValues("mutterschutzAnderesKindVon")),
        bis: parseGermanDateString(getValues("mutterschutzAnderesKindBis")),
      };
      ausklammerungen.push(mutterschutzAnderesKind);
    }

    if (getValues("krankheitVon") && getValues("krankheitBis")) {
      const erkrankung: Ausklammerung = {
        beschreibung: "Mutterschutz für älteres Kind",
        von: parseGermanDateString(getValues("krankheitVon")),
        bis: parseGermanDateString(getValues("krankheitBis")),
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
                error={errors.mutterschutzDiesesKindVon?.message}
                {...register("mutterschutzDiesesKindVon", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">
                Ende des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={errors.mutterschutzDiesesKindBis?.message}
                {...register("mutterschutzDiesesKindBis", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
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
                error={errors.mutterschutzAnderesKindVon?.message}
                {...register("mutterschutzAnderesKindVon", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">
                Ende des Mutterschutzes
              </label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={errors.mutterschutzAnderesKindBis?.message}
                {...register("mutterschutzAnderesKindBis", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
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
                error={errors.elterngeldVon?.message}
                {...register("elterngeldVon", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">Ende</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={errors.elterngeldBis?.message}
                {...register("elterngeldBis", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
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
                error={errors.krankheitVon?.message}
                {...register("krankheitVon", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
              />
            </div>
            <div>
              <label className="mt-20 block text-16">Ende</label>
              <CustomDate
                // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                error={errors.krankheitBis?.message}
                {...register("krankheitBis", {
                  required: "Dieses Feld ist erforderlich",
                  pattern: {
                    value: /^\d{2}\.\d{2}\.\d{4}$/,
                    message: "Bitte das Feld vollständig ausfüllen",
                  },
                })}
              />
            </div>
          </div>
        </section>
      )}

      <Button
        className="mt-40"
        type="button"
        // onClick={}
        buttonStyle="noLine"
      >
        <RedoIcon className="pr-4" />
        Seite überspringen
      </Button>
    </form>
  );
}
