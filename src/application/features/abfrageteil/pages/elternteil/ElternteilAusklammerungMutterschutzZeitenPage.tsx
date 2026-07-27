import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungMutterschutzGeschwisterkindZeiten,
  ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
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
import { berechneMutterschutz } from "@/mutterschutzrechner";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenInput =
  z.input<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeitenOutput =
  z.output<
    typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
  >;

export function ElternteilAusklammerungMutterschutzZeitenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungMutterschutzZeitenAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatumGeschwisterkind =
    geschwisterkinder[routeParams.geschwisterIndex]?.geburtsdatum;
  const vornameGeschwisterkind =
    geschwisterkinder[routeParams.geschwisterIndex]?.name;
  const mutterschutzGeschwisterkind = geburtsdatumGeschwisterkind
    ? berechneMutterschutz(
        new Date(
          geburtsdatumGeschwisterkind.year,
          geburtsdatumGeschwisterkind.month - 1,
          geburtsdatumGeschwisterkind.day,
        ),
        undefined,
        geschwisterkinder[routeParams.geschwisterIndex]?.hatBehinderung,
      )
    : undefined;
  const bisherigeAusklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  const memoizedDefaultValues = useMemo(() => {
    const wiederverwendbareZeiten = encodeSafely(
      ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
      letztesGueltigesEvent,
    );

    if (wiederverwendbareZeiten) {
      return wiederverwendbareZeiten;
    }

    if (mutterschutzGeschwisterkind) {
      return {
        mutterschutzGeschwisterkind: {
          von: mutterschutzGeschwisterkind.startdatum.toLocaleDateString(
            "de-DE",
            { day: "2-digit", month: "2-digit", year: "numeric" },
          ),
          bis: mutterschutzGeschwisterkind.enddatum.toLocaleDateString(
            "de-DE",
            { day: "2-digit", month: "2-digit", year: "numeric" },
          ),
        },
      };
    }

    return {
      mutterschutzGeschwisterkind: { von: "", bis: "" },
    };
  }, [letztesGueltigesEvent, mutterschutzGeschwisterkind]);

  const { handleSubmit, register, formState } = useFormWithValidationTracking<
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

  const onSubmit = async (
    values: ElternteilAusklammerungMutterschutzGeschwisterkindZeiten,
  ) => {
    const geschwisterIndex = routeParams.geschwisterIndex;
    const neueAusklammerung = {
      ...values.mutterschutzGeschwisterkind,
      grund: "mutterschutzGeschwisterkind",
      geschwisterIndex,
    };
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
        geburtsdatum,
        geschwisterkinder,
        [...bisherigeAusklammerungen, neueAusklammerung],
        routeParams.geschwisterIndex,
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

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <div className="text-container">
            <h3>
              Von wann bis wann war {vorname} im Mutterschutz für{" "}
              {vornameGeschwisterkind}?
            </h3>
            <p>
              Der Mutterschutz gilt in der Regel 6 Wochen vor dem errechneten
              Geburtstermin und endet 8 Wochen danach.{" "}
              {geschwisterkinder[routeParams.geschwisterIndex]?.hatBehinderung
                ? "Bei der Geburt eines Kindes mit Behinderung verlängert sich dieser Zeitraum auf 12 Wochen."
                : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
            <div>
              <label
                className={classNames("block label-small", {
                  "text-danger": formErrors.mutterschutzGeschwisterkind?.von,
                })}
                htmlFor="mutterschutz-von"
              >
                Beginn des Mutterschutzes (TT.MM.JJJJ)
              </label>
              <DateInput
                id="mutterschutz-von"
                {...register("mutterschutzGeschwisterkind.von")}
                error={formErrors.mutterschutzGeschwisterkind?.von?.message}
              />
            </div>

            <div>
              <label
                className={classNames("block label-small", {
                  "text-danger": formErrors.mutterschutzGeschwisterkind?.bis,
                })}
                htmlFor="mutterschutz-bis"
              >
                Ende des Mutterschutzes (TT.MM.JJJJ)
              </label>
              <DateInput
                id="mutterschutz-bis"
                {...register("mutterschutzGeschwisterkind.bis")}
                error={formErrors.mutterschutzGeschwisterkind?.bis?.message}
              />
            </div>
          </div>

          <InfoText
            question="Der vorausgefüllte Zeitraum stimmt nicht?"
            answer={
              <>
                <p>
                  Der Mutterschutz umfasst in der Regel 6 Wochen vor und 8
                  Wochen nach der Geburt. Wir haben aufgrund des eingetragenen
                  Geburtstdatums die Daten für den Mutterschutz automatisch
                  berechnet.
                </p>
                <p>
                  Wenn Sie wissen, dass diese Daten nicht stimmen, können Sie
                  diese einfach ändern. Das ist meist der Fall, wenn:
                </p>
                <ul>
                  <li>das Kind zu früh geboren wurde</li>
                  <li>Mehrlinge (Zwillinge, Drillinge etc.) geboren werden</li>
                  <li>das Kind eine Behinderung hat </li>
                  <li>das Kind ein geringes Geburtsgewicht hat</li>
                </ul>
                <p>
                  Sie finden diese Angaben beispielsweise im Mutterpass oder auf
                  der Bescheinigung der Ärztin / des Arztes oder der Hebamme.
                </p>
              </>
            }
          />
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
