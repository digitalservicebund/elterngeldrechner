import AddIcon from "~icons/material-symbols/add-circle-outline";
import CloseIcon from "~icons/material-symbols/close";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungErkrankungZeiten,
  ElternteilAusklammerungErkrankungZeitenSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { Page } from "@/application/features/components";
import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung } from "@/application/features/abfrageteil/domain/berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung";
import { findeGeburtsdatum } from "@/application/features/abfrageteil/domain/findeGeburtsdatum";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export type ElternteilAusklammerungErkrankungZeitenInput = z.input<
  typeof ElternteilAusklammerungErkrankungZeitenSchema
>;

export type ElternteilAusklammerungErkrankungZeitenOutput = z.output<
  typeof ElternteilAusklammerungErkrankungZeitenSchema
>;

export function ElternteilAusklammerungErkrankungZeitenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

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
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterkinder = findeGeschwisterkinder(eventStream);

  const { handleSubmit, control, register, formState } =
    useFormWithValidationTracking<
      ElternteilAusklammerungErkrankungZeitenInput,
      undefined,
      ElternteilAusklammerungErkrankungZeitenOutput
    >({
      resolver: zodResolver(ElternteilAusklammerungErkrankungZeitenSchema),
      defaultValues: memoizedDefaultValues,
    });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: ElternteilAusklammerungErkrankungZeiten) => {
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
        geburtsdatum,
        geschwisterkinder,
        [],
      );

    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "erkrankungSchwangerschaft",
  });

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <div className="text-container">
            <h3>
              Von wann bis wann war {vorname} wegen dieser Schwangerschaft
              krankgeschrieben?
            </h3>

            <p>
              Tragen Sie den Zeitraum ein, in dem {vorname} Krankengeld bezogen
              hat. Wir überspringen diese Monate dann bei der Berechnung.
            </p>
          </div>

          <InfoText
            question="Wo finde ich die Angaben zur Krankheit wegen der Schwangerschaft?"
            answer={
              <>
                <p>
                  Schauen Sie auf Ihr ärztliches Attest. Dort stehen die genauen
                  Daten. Tragen Sie diese hier ein.
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

          <div className="flex flex-col gap-kern-default">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col">
                <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
                  <div>
                    <label
                      className={classNames("block label-small", {
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
                      className={classNames("block label-small", {
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
                    className="mb-kern-default p-4"
                    onClick={() => remove(index)}
                    aria-label="Zeile löschen"
                  >
                    <span className="flex items-center gap-4 label-small">
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
            <span className="flex items-center gap-4 label-small">
              <AddIcon className="mt-4" />
              <span>Weiteren Zeitraum hinzufügen</span>
            </span>
          </Button>
        </div>

        <div className="button-group">
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
