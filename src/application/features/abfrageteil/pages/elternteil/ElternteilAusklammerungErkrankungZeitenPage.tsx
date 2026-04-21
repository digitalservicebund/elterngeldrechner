import AddIcon from "~icons/material-symbols/add-circle-outline";
import CloseIcon from "~icons/material-symbols/close";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungErkrankungZeiten,
  ElternteilAusklammerungErkrankungZeitenSchema,
  ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { Page } from "@/application/features/components";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";

export type ElternteilAusklammerungErkrankungZeitenInput = z.input<
  typeof ElternteilAusklammerungErkrankungZeitenSchema
>;

export type ElternteilAusklammerungErkrankungZeitenOutput = z.output<
  typeof ElternteilAusklammerungErkrankungZeitenSchema
>;

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenInput =
  z.input<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenOutput =
  z.output<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export function ElternteilAusklammerungErkrankungZeitenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungErkrankungZeitenAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const memoizedDefaultValues = useMemo(() => {
    const wiederverwendbareZeiten = encodeSafely(
      ElternteilAusklammerungErkrankungZeitenSchema,
      letztesGueltigesEvent,
    );

    if (
      wiederverwendbareZeiten &&
      wiederverwendbareZeiten.erkrankungSchwangerschaft.length > 0
    ) {
      return wiederverwendbareZeiten;
    }

    return {
      erkrankungSchwangerschaft: [{ von: "", bis: "" }],
    };
  }, [letztesGueltigesEvent]);

  const eventStream = filtereValideEventHistorie();
  const anzahlGeschwister = findeGeschwisterkinder(eventStream).length;

  const { handleSubmit, control, register, formState } = useForm<
    ElternteilAusklammerungErkrankungZeitenInput,
    undefined,
    ElternteilAusklammerungErkrankungZeitenOutput
  >({
    resolver: zodResolver(ElternteilAusklammerungErkrankungZeitenSchema),
    defaultValues: memoizedDefaultValues,
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAusklammerungErkrankungZeiten) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        anzahlGeschwister,
      },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "erkrankungSchwangerschaft",
  });

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 className="mb-20">
            Von wann bis wann war Sascha krank wegen dieser Schwangerschaft?
          </h3>

          <InfoText
            question="Wo finde ich dieses Angaben?"
            answer={
              <>
                <p className="mb-20">
                  Schauen Sie auf Ihr ärztliches Attest. Dort stehen die genauen
                  Daten. Bitte tragen Sie diese hier ein.
                </p>
                <p>
                  <strong>Wichtig: </strong>Eine normale Krankmeldung (gelber
                  Zettel oder digitale Krankmeldung) reicht nicht aus. Sie
                  benötigen eine Bestätigung vom Arzt oder von der Ärztin, dass
                  die Krankheit direkt durch die Schwangerschaft verursacht
                  wurde. Dieses Attest müssen Sie später bei der Beantragung von
                  Elterngeld als Nachweis einreichen.
                </p>
              </>
            }
          />
        </div>

        <div className="flex flex-col gap-32">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col">
              <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
                <div>
                  <label
                    className={classNames("mb-4 block text-16", {
                      "text-danger":
                        formErrors.erkrankungSchwangerschaft?.[index]?.von,
                    })}
                    htmlFor={`${field.id}-von`}
                  >
                    Von (TT.MM.JJJJ)
                  </label>
                  <DateInput
                    id={`${field.id}-von`}
                    {...register(`erkrankungSchwangerschaft.${index}.von`)}
                    error={
                      formErrors.erkrankungSchwangerschaft?.[index]?.von
                        ?.message
                    }
                  />
                </div>

                <div>
                  <label
                    className={classNames("mb-4 block text-16", {
                      "text-danger":
                        formErrors.erkrankungSchwangerschaft?.[index]?.bis,
                    })}
                    htmlFor={`${field.id}-bis`}
                  >
                    Bis (TT.MM.JJJJ)
                  </label>
                  <DateInput
                    id={`${field.id}-bis`}
                    {...register(`erkrankungSchwangerschaft.${index}.bis`)}
                    error={
                      formErrors.erkrankungSchwangerschaft?.[index]?.bis
                        ?.message
                    }
                  />
                </div>
              </div>

              {index > 0 && (
                <Button
                  type="button"
                  buttonStyle="link"
                  className="mb-16 p-4"
                  onClick={() => remove(index)}
                  aria-label="Zeile löschen"
                >
                  <span className="flex items-center gap-4 text-16">
                    <CloseIcon className="mt-4" />
                    <span>Zeitraum löschen</span>
                  </span>
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          buttonStyle="link"
          className="p-4"
          onClick={() => append({ von: "", bis: "" })}
        >
          <span className="flex items-center gap-4 text-16">
            <AddIcon className="mt-4" />
            <span>Weiteren Zeitraum hinzufügen</span>
          </span>
        </Button>

        <div className="mt-40 flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </form>
    </Page>
  );
}
