import { useCallback } from "react";
import { ArrayPath, Path, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/application/components";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
};

export function AusklammerungsZeitenForm({ id, onSubmit, elternteil }: Props) {
  const store = useAppStore();

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAusklammerungsZeiten = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
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

  const ausklammerungenMutterschutzAnderesKind = `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.ausklammerungenMutterschutzAnderesKind`;
  const ausklammerungenElterngeldAnderesKind = `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.ausklammerungenElterngeldAnderesKind`;
  const ausklammerungenErkrankung = `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.ausklammerungenErkrankung`;

  const { fields: fieldsMutterschutz, append: appendMutterschutz } =
    useFieldArray({
      control,
      name: ausklammerungenMutterschutzAnderesKind as ArrayPath<StepPrototypState>,
    });

  const { fields: fieldsElterngeld, append: appendElterngeld } = useFieldArray({
    control,
    name: ausklammerungenElterngeldAnderesKind as ArrayPath<StepPrototypState>,
  });

  const { fields: fieldsErkrankung, append: appendErkrankung } = useFieldArray({
    control,
    name: ausklammerungenErkrankung as ArrayPath<StepPrototypState>,
  });

  return (
    <form
      id={id}
      onSubmit={handleSubmit(submitAusklammerungsZeiten)}
      noValidate
    >
      <h3 className="my-40">Bitte machen Sie Detailangaben</h3>

      {hasMutterschutzAnderesKind ? (
        <section className="mt-32">
          <h5>
            Von wann bis wann waren Sie für ein älteres Kind im Mutterschutz?
          </h5>

          {fieldsMutterschutz.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap gap-56 *:grow *:basis-[22rem]"
            >
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenMutterschutzAnderesKind-${index}-von`}
                >
                  Beginn des Mutterschutzes (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenMutterschutzAnderesKind-${index}-von`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenMutterschutzAnderesKind?.[
                          index
                        ]?.von?.message
                      : errors.ET2?.ausklammerungenMutterschutzAnderesKind?.[
                          index
                        ]?.von?.message
                  }
                  {...register(
                    `${ausklammerungenMutterschutzAnderesKind}.${index}.von` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const bisFieldPath =
                          `${ausklammerungenMutterschutzAnderesKind}.${index}.bis` as Path<StepPrototypState>;
                        const bisValue = getValues(bisFieldPath);

                        if (bisValue && !value) {
                          return "Bitte geben Sie auch das Startdatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenMutterschutzAnderesKind-${index}-bis`}
                >
                  Ende des Mutterschutzes (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenMutterschutzAnderesKind-${index}-bis`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenMutterschutzAnderesKind?.[
                          index
                        ]?.bis?.message
                      : errors.ET2?.ausklammerungenMutterschutzAnderesKind?.[
                          index
                        ]?.bis?.message
                  }
                  {...register(
                    `${ausklammerungenMutterschutzAnderesKind}.${index}.bis` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const vonFieldPath =
                          `${ausklammerungenMutterschutzAnderesKind}.${index}.von` as Path<StepPrototypState>;
                        const vonValue = getValues(vonFieldPath);

                        if (vonValue && !value) {
                          return "Bitte geben Sie auch das Enddatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            className="pt-20 text-left !text-base"
            type="button"
            buttonStyle="link"
            onClick={() => {
              appendMutterschutz({ von: null, bis: null });
            }}
          >
            + Weiteren Zeitraum für Mutterschutz hinzufügen
          </Button>
        </section>
      ) : null}

      {hasElterngeldAnderesKind ? (
        <section className="mt-32">
          <h5>
            Von wann bis wann haben Sie für ein älteres Kind (maximal 14 Monate
            alt) Elterngeld bekommen?
          </h5>

          {fieldsElterngeld.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap gap-56 *:grow *:basis-[22rem]"
            >
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenElterngeldAnderesKind-${index}-von`}
                >
                  Beginn (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenElterngeldAnderesKind-${index}-von`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenElterngeldAnderesKind?.[
                          index
                        ]?.von?.message
                      : errors.ET2?.ausklammerungenElterngeldAnderesKind?.[
                          index
                        ]?.von?.message
                  }
                  {...register(
                    `${ausklammerungenElterngeldAnderesKind}.${index}.von` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const bisFieldPath =
                          `${ausklammerungenElterngeldAnderesKind}.${index}.bis` as Path<StepPrototypState>;
                        const bisValue = getValues(bisFieldPath);

                        if (bisValue && !value) {
                          return "Bitte geben Sie auch das Startdatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenElterngeldAnderesKind-${index}-bis`}
                >
                  Ende (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenElterngeldAnderesKind-${index}-bis`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenElterngeldAnderesKind?.[
                          index
                        ]?.bis?.message
                      : errors.ET2?.ausklammerungenElterngeldAnderesKind?.[
                          index
                        ]?.bis?.message
                  }
                  {...register(
                    `${ausklammerungenElterngeldAnderesKind}.${index}.bis` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const vonFieldPath =
                          `${ausklammerungenElterngeldAnderesKind}.${index}.von` as Path<StepPrototypState>;
                        const vonValue = getValues(vonFieldPath);

                        if (vonValue && !value) {
                          return "Bitte geben Sie auch das Enddatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            className="pt-20 text-left !text-base"
            type="button"
            buttonStyle="link"
            onClick={() => {
              appendElterngeld({ von: null, bis: null });
            }}
          >
            + Weiteren Zeitraum für Elterngeld hinzufügen
          </Button>
        </section>
      ) : null}

      {hasErkrankung ? (
        <section className="mt-32">
          <h5>
            Von wann bis wann waren Sie wegen Ihrer Schwangerschaft krank?
          </h5>

          {fieldsErkrankung.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-wrap gap-56 *:grow *:basis-[22rem]"
            >
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenErkrankung-${index}-von`}
                >
                  Beginn (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenErkrankung-${index}-von`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenErkrankung?.[index]?.von
                          ?.message
                      : errors.ET2?.ausklammerungenErkrankung?.[index]?.von
                          ?.message
                  }
                  {...register(
                    `${ausklammerungenErkrankung}.${index}.von` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const bisFieldPath =
                          `${ausklammerungenErkrankung}.${index}.bis` as Path<StepPrototypState>;
                        const bisValue = getValues(bisFieldPath);

                        if (bisValue && !value) {
                          return "Bitte geben Sie auch das Startdatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
              <div>
                <label
                  className="mb-4 mt-20 block text-16"
                  htmlFor={`ausklammerungenErkrankung-${index}-bis`}
                >
                  Ende (TT.MM.JJJJ)
                </label>
                <CustomDate
                  id={`ausklammerungenErkrankung-${index}-bis`}
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.ausklammerungenErkrankung?.[index]?.bis
                          ?.message
                      : errors.ET2?.ausklammerungenErkrankung?.[index]?.bis
                          ?.message
                  }
                  {...register(
                    `${ausklammerungenErkrankung}.${index}.bis` as Path<StepPrototypState>,
                    {
                      validate: (value) => {
                        const vonFieldPath =
                          `${ausklammerungenErkrankung}.${index}.von` as Path<StepPrototypState>;
                        const vonValue = getValues(vonFieldPath);

                        if (vonValue && !value) {
                          return "Bitte geben Sie auch das Enddatum an.";
                        }
                        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

                        if (value && !dateRegex.test(value as string)) {
                          return "Bitte das Datum vollständig (TT.MM.JJJJ) ausfüllen";
                        }

                        return true;
                      },
                    },
                  )}
                />
              </div>
            </div>
          ))}

          <Button
            className="pt-20 text-left !text-base"
            type="button"
            buttonStyle="link"
            onClick={() => {
              appendErkrankung({ von: null, bis: null });
            }}
          >
            + Weiteren Zeitraum für Krankheit in der Schwangerschaft hinzufügen
          </Button>
        </section>
      ) : null}
    </form>
  );
}
