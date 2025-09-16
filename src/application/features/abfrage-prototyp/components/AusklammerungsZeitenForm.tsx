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

  const { register, handleSubmit, getValues, setValue } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAusklammerungsZeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values, undefined, hasAusklammerungsgrund, ausklammerungen());
    },
    [store, onSubmit],
  );

  // const validateMonth = (date: string) => {
  //   const [inputDay, inputMonth, inputYear] = date.split(".");
  //   const year = Number.parseInt(inputYear ?? "0");
  //   const inputDate = new Date(`${year}-${inputMonth}-${inputDay}`);
  //   const now = new Date(Date.now());
  //   const dateMaxMonthAgo = new Date(
  //     now.setUTCFullYear(now.getUTCFullYear() - 3),
  //   );

  //   if (inputDate >= dateMaxMonthAgo) {
  //     return true;
  //   } else {
  //     return `Elterngeld wird maximal für 32 Lebensmonate rückwirkend gezahlt.`;
  //   }
  // };

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const ungefährerBemessungszeitraum = berechneUngefaehrenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow ?? PersonPageFlow.noFlow,
  );

  const berechneterMutterschutzBeginn = (geburtsdatum: Date): Date => {
    const date = new Date(geburtsdatum);
    return new Date(date.setDate(date.getDate() - 42));
  };

  function berechneMutterschutz() {
    if (getValues("hasMutterschutzDiesesKind")) {
      setValue(
        "mutterschutzDiesesKindBis",
        geburtsdatumDesKindes.toLocaleDateString(),
      );
      setValue(
        "mutterschutzDiesesKindVon",
        berechneterMutterschutzBeginn(
          geburtsdatumDesKindes,
        ).toLocaleDateString(),
      );
    }
  }
  berechneMutterschutz();

  const ausklammerungen = (): Ausklammerung[] => {
    const ausklammerungen: Ausklammerung[] = [];

    if (
      getValues("mutterschutzDiesesKindVon") &&
      getValues("mutterschutzDiesesKindBis")
    ) {
      const mutterschutz: Ausklammerung = {
        beschreibung: "Mutterschutz für dieses Kind",
        von: parseGermanDateString(getValues("mutterschutzDiesesKindVon")),
        bis: parseGermanDateString(getValues("mutterschutzDiesesKindBis")),
      };
      ausklammerungen.push(mutterschutz);
    }

    if (
      getValues("mutterschutzAnderesKindVon") &&
      getValues("mutterschutzAnderesKindBis")
    ) {
      const mutterschutz: Ausklammerung = {
        beschreibung: "Mutterschutz für älteres Kind",
        von: parseGermanDateString(getValues("mutterschutzAnderesKindVon")),
        bis: parseGermanDateString(getValues("mutterschutzAnderesKindBis")),
      };
      ausklammerungen.push(mutterschutz);
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

      <section className="mt-32">
        <h5>Von wann bis wann waren oder werden Sie im Mutterschutz sein?</h5>
        <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
          <div>
            <label className="mt-20 block text-16">
              Beginn des Mutterschutzes
            </label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("mutterschutzDiesesKindVon", {
                required: "Dieses Feld ist erforderlich",
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
          <div>
            <label className="mt-20 block text-16">
              Ende des Mutterschutzes
            </label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("mutterschutzDiesesKindBis", {
                required: "Dieses Feld ist erforderlich",
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
        </div>
      </section>

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
              {...register("mutterschutzAnderesKindVon", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
          <div>
            <label className="mt-20 block text-16">
              Ende des Mutterschutzes
            </label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("mutterschutzAnderesKindBis", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
        </div>
      </section>

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
              {...register("elterngeldVon", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
          <div>
            <label className="mt-20 block text-16">Ende</label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("elterngeldBis", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
        </div>
      </section>

      <section className="mt-32">
        <h5>Von wann bis wann waren Sie wegen Ihrer Schwangerschaft krank?</h5>
        <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
          <div>
            <label className="mt-20 block text-16">Beginn</label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("krankheitVon", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
          <div>
            <label className="mt-20 block text-16">Ende</label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("krankheitBis", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
                // validate: validateMonth,
              })}
            />
          </div>
        </div>
      </section>

      <section className="mt-32">
        <h5>
          Von wann bis wann haben Sie Wehrdienst oder Zivildienst geleistet?
        </h5>
        <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
          <div>
            <label className="mt-20 block text-16">Beginn</label>
            <CustomDate
              // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
              {...register("dienstVon", {
                required: undefined,
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
              {...register("dienstBis", {
                required: undefined,
                pattern: {
                  value: /^\d{2}\.\d{2}\.\d{4}$/,
                  message: "Bitte das Feld vollständig ausfüllen",
                },
              })}
            />
          </div>
        </div>
      </section>
    </form>
  );
}
