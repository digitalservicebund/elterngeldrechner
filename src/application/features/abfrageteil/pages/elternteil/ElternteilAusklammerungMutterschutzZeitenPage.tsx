import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { berechneMutterschutz } from "@/mutterschutzrechner";

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

  const eventStream = filtereValideEventHistorie();
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatumGeschwisterkind =
    geschwisterkinder[routeParams.geschwisterIndex]?.geburtsdatum;
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
  const geburtsdatumGeschwisterkindString =
    geburtsdatumGeschwisterkind?.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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

  const { handleSubmit, register, formState } = useForm<
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

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

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
            Geschwisterkind (geb. {geburtsdatumGeschwisterkindString})?
          </h3>
          <p>
            Der Mutterschutz gilt in der Regel 6 Wochen vor dem errechneten
            Geburtstermin und endet 8 Wochen danach.{" "}
            {geschwisterkinder[routeParams.geschwisterIndex]?.hatBehinderung
              ? "Bei der Geburt eines Kindes mit Behinderung verlängert sich dieser Zeitraum auf 12 Wochen."
              : ""}
          </p>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-10 *:grow *:basis-[22rem]">
            <div>
              <label
                className={classNames("mb-4 block text-16", {
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
                className={classNames("mb-4 block text-16", {
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
            className="mt-20"
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
