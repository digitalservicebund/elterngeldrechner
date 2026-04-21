import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungMutterschutzGeschwisterkindZeiten,
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

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenInput =
  z.input<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenOutput =
  z.output<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export function ElternteilAusklammerungMutterschutzZeitenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungMutterschutzZeitenAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const memoizedDefaultValues = useMemo(() => {
    const wiederverwendbareZeiten = encodeSafely(
      ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
      letztesGueltigesEvent,
    );

    if (
      wiederverwendbareZeiten &&
      wiederverwendbareZeiten.mutterschutzGeschwisterkind.length > 0
    ) {
      return wiederverwendbareZeiten;
    }

    return {
      mutterschutzGeschwisterkind: [{ von: "", bis: "" }],
    };
  }, [letztesGueltigesEvent]);

  const eventStream = filtereValideEventHistorie();
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatumGeschwisterkind = geschwisterkinder[
    routeParams.geschwisterIndex
  ]?.geburtsdatum.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const anzahlGeschwister = geschwisterkinder.length;

  const { handleSubmit, control, register, formState } = useForm<
    ElternteilAusklammerungMutterschutzGeschwisterkindZeitenInput,
    undefined,
    ElternteilAusklammerungMutterschutzGeschwisterkindZeitenOutput
  >({
    resolver: zodResolver(
      ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
    ),
    defaultValues: memoizedDefaultValues,
  });

  const { errors: formErrors } = formState;

  const onSubmit = (
    values: ElternteilAusklammerungMutterschutzGeschwisterkindZeiten,
  ) => {
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

  const { fields } = useFieldArray({
    control,
    name: "mutterschutzGeschwisterkind",
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
          <h3>
            Von wann bis wann war {vorname} im Mutterschutz für das
            Geschwisterkind (geb. {geburtsdatumGeschwisterkind})?
          </h3>
          <p>
            Der Mutterschutz gilt in der Regel 6 Wochen vor der dem errechneten
            Geburtstermin und endet 8 Wochen danach.
          </p>
        </div>

        <div className="flex flex-col gap-32">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col">
              <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
                <div>
                  <label
                    className={classNames("mb-4 block text-16", {
                      "text-danger":
                        formErrors.mutterschutzGeschwisterkind?.[index]?.von,
                    })}
                    htmlFor={`${field.id}-von`}
                  >
                    Beginn des Mutterschutzes (TT.MM.JJJJ)
                  </label>
                  <DateInput
                    id={`${field.id}-von`}
                    {...register(`mutterschutzGeschwisterkind.${index}.von`)}
                    error={
                      formErrors.mutterschutzGeschwisterkind?.[index]?.von
                        ?.message
                    }
                  />
                </div>

                <div>
                  <label
                    className={classNames("mb-4 block text-16", {
                      "text-danger":
                        formErrors.mutterschutzGeschwisterkind?.[index]?.bis,
                    })}
                    htmlFor={`${field.id}-bis`}
                  >
                    Ende des Mutterschutzes (TT.MM.JJJJ)
                  </label>
                  <DateInput
                    id={`${field.id}-bis`}
                    {...register(`mutterschutzGeschwisterkind.${index}.bis`)}
                    error={
                      formErrors.mutterschutzGeschwisterkind?.[index]?.bis
                        ?.message
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoText
          question="Der vorausgefüllte Zeitraum stimmt nicht?"
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
                die Krankheit direkt durch die Schwangerschaft verursacht wurde.
                Dieses Attest müssen Sie später bei der Beantragung von
                Elterngeld als Nachweis einreichen.
              </p>
            </>
          }
        />

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
