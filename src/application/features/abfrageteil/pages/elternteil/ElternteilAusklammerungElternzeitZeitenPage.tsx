import AddIcon from "~icons/material-symbols/add-circle-outline";
import CloseIcon from "~icons/material-symbols/close";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungElterngeldGeschwisterkindZeiten,
  ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { Page } from "@/application/features/components";
import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung } from "@/application/features/abfrageteil/domain/berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung";
import { findeAusklammerungen } from "@/application/features/abfrageteil/domain/findeAusklammerungen";
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

export type ElternteilAusklammerungElterngeldGeschwisterkindZeitenInput =
  z.input<typeof ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema>;

export type ElternteilAusklammerungElterngeldGeschwisterkindZeitenOput =
  z.output<typeof ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema>;

export function ElternteilAusklammerungElternzeitZeitenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungElternzeitZeitenAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const memoizedDefaultValues = useMemo(() => {
    const wiederverwendbareZeiten = encodeSafely(
      ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema,
      letztesGueltigesEvent,
    );

    if (
      wiederverwendbareZeiten &&
      wiederverwendbareZeiten.elterngeldGeschwisterkind.length > 0
    ) {
      return wiederverwendbareZeiten;
    }

    return {
      elterngeldGeschwisterkind: [{ von: "", bis: "" }],
    };
  }, [letztesGueltigesEvent]);

  const eventStream = filtereValideEventHistorie();
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterIndex = routeParams.geschwisterIndex;
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatumGeschwisterkind = geschwisterkinder[
    routeParams.geschwisterIndex
  ]?.geburtsdatum.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const bisherigeAusklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );
  const istMutterschutzFuerGeschwisterkindMoeglich = () => {
    if (routeParams.elternteilIndex === 0) return true;

    const ausklammerungenElternteil1 = findeAusklammerungen(eventStream, 0);
    if (
      ausklammerungenElternteil1.some(
        (ausklammerung) =>
          ausklammerung.grund === "mutterschutzGeschwisterkind" &&
          ausklammerung.geschwisterIndex === geschwisterIndex,
      )
    )
      return false;

    return true;
  };

  const { handleSubmit, control, register, formState } =
    useFormWithValidationTracking<
      ElternteilAusklammerungElterngeldGeschwisterkindZeitenInput,
      undefined,
      ElternteilAusklammerungElterngeldGeschwisterkindZeitenOput
    >({
      resolver: zodResolver(
        ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema,
      ),
      defaultValues: memoizedDefaultValues,
    });

  const { errors: formErrors } = formState;

  const onSubmit = async (
    values: ElternteilAusklammerungElterngeldGeschwisterkindZeiten,
  ) => {
    const neueAusklammerungen = values.elterngeldGeschwisterkind.map(
      (zeit) => ({
        ...zeit,
        grund: "elterngeldGeschwisterkind",
        geschwisterIndex,
      }),
    );
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
        geburtsdatum,
        geschwisterkinder,
        [...bisherigeAusklammerungen, ...neueAusklammerungen],
        geschwisterIndex,
        istMutterschutzFuerGeschwisterkindMoeglich(),
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
    name: "elterngeldGeschwisterkind",
  });

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>
            Von wann bis wann hat {vorname} Elterngeld für das Geschwisterkind
            (geb. {geburtsdatumGeschwisterkind}) erhalten?
          </h3>

          <p>
            <strong>Wichtig: </strong>Beachten Sie, dass Elterngeld bis maximal
            zum 14. Lebensmonat berücksichtigt werden kann. Tragen Sie den
            zulässigen Zeitraum entsprechend ein.
          </p>

          <InfoText
            question="Wo finde ich diese Angaben?"
            answer={
              <>
                <p className="mb-20">
                  Den Zeitraum können Sie auf Ihrem Elterngeld-Bescheid für das
                  Geschwisterkind ablesen. Falls Sie den Bescheid nicht
                  griffbereit haben, helfen Ihnen auch Ihre Kontoauszüge: Suchen
                  Sie zum Beispiel nach Zahlungen von der Elterngeldstelle.
                </p>
                <p className="mb-0 mt-20 font-bold">Was ist wichtig für Sie?</p>
                <ul>
                  <li>
                    Das gilt nur für Elterngeld, das Sie bis zum 14. Lebensmonat
                    des Geschwisterkindes bezogen haben.
                  </li>
                  <li>
                    Geben Sie den gesamten Zeitraum an (den ersten und den
                    letzten Monat).
                  </li>
                  <li>
                    Es ist egal, ob Sie Basiselterngeld, ElterngeldPlus oder den
                    Partnerschaftsbonus erhalten haben.
                  </li>
                  <li>
                    Falls Sie zwischendurch Pausen beim Elterngeld hatten,
                    können Sie einfach weitere Zeiträume hinzufügen.
                  </li>
                </ul>
              </>
            }
          />

          <div className="flex flex-col gap-kern-default">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col">
                <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
                  <div>
                    <label
                      className={classNames("mb-4 block text-16", {
                        "text-danger":
                          formErrors.elterngeldGeschwisterkind?.[index]?.von,
                      })}
                      htmlFor={`${field.id}-von`}
                    >
                      Von (TT.MM.JJJJ)
                    </label>
                    <DateInput
                      id={`${field.id}-von`}
                      {...register(`elterngeldGeschwisterkind.${index}.von`)}
                      error={
                        formErrors.elterngeldGeschwisterkind?.[index]?.von
                          ?.message
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={classNames("mb-4 block text-16", {
                        "text-danger":
                          formErrors.elterngeldGeschwisterkind?.[index]?.bis,
                      })}
                      htmlFor={`${field.id}-bis`}
                    >
                      Bis (TT.MM.JJJJ)
                    </label>
                    <DateInput
                      id={`${field.id}-bis`}
                      {...register(`elterngeldGeschwisterkind.${index}.bis`)}
                      error={
                        formErrors.elterngeldGeschwisterkind?.[index]?.bis
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
