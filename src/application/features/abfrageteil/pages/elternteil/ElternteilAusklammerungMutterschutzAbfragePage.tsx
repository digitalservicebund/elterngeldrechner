import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungMutterschutzGeschwisterkindAbfrage,
  ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
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

export function ElternteilAusklammerungMutterschutzAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungMutterschutzAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const vornameGeschwisterkind =
    geschwisterkinder[routeParams.geschwisterIndex]?.name;
  const bisherigeAusklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(
      ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
    ),
    defaultValues: encodeSafely(
      ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (
    values: ElternteilAusklammerungMutterschutzGeschwisterkindAbfrage,
  ) => {
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
        geburtsdatum,
        geschwisterkinder,
        [...bisherigeAusklammerungen],
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
              Hat {vorname} Mutterschaftsgeld für {vornameGeschwisterkind}{" "}
              erhalten?
            </h3>

            <p>
              Wenn Sie Mutterschaftsgeld für ein Geschwisterkind erhalten haben,
              können wir diese Zeit bei der Berechnung überspringen. So wird Ihr
              Elterngeld auf Basis Ihrer höheren Einkünfte berechnet.
            </p>
          </div>

          <InfoText
            question="Warum wird das gefragt?"
            answer={
              <>
                <p>
                  Mutterschaftsgeld (zum Beispiel von Ihrer Krankenkasse)
                  sichert Ihr Einkommen, wenn Sie während Ihrer Schwangerschaft
                  oder nach der Geburt Ihres Kindes nicht arbeiten dürfen. Es
                  zählt bei der Berechnung des Elterngeldes nicht als normales
                  Einkommen. Würden wir die Zeit, in der Sie Mutterschaftsgeld
                  bekommen, mitzählen, bekämen Sie für dieses Kind weniger
                  Elterngeld.
                </p>
                <p>
                  Deshalb „überspringen" wir diese Monate. Wir schauen
                  stattdessen weiter zurück in die Vergangenheit auf Monate, in
                  denen Sie mehr Einkommen hatten.
                </p>

                <p className="font-bold">Was ist Mutterschaftsgeld?</p>
                <p>
                  Der Anspruch auf Mutterschaftsleistungen besteht grundsätzlich
                  in den letzten 6 Wochen vor der Geburt, am Tag der Entbindung
                  und 8 Wochen nach der Geburt (Schutzfristen).
                </p>
                <p>Während der Mutterschutzfrist bekommen Sie:</p>
                <ul>
                  <li>
                    Mutterschaftsgeld Ihrer Krankenkasse, wenn Sie gesetzlich
                    versichert sind.
                  </li>
                  <li>
                    Mutterschaftsgeld des Bundesamtes für Soziale Sicherung,
                    wenn Sie privat krankenversichert oder bei einer
                    gesetzlichen Krankenkasse familienversichert sind.
                  </li>
                  <li>
                    Arbeitgeber-Zuschuss zum Mutterschaftsgeld, wenn Ihr
                    durchschnittlicher Nettolohn pro Tag höher als 13 Euro ist.
                  </li>
                </ul>

                <p className="font-bold">
                  Was muss ich später für den Antrag beachten?
                </p>
                <ul>
                  <li>
                    <strong>Für Angestellte: </strong>Wenn Sie Mutterschaftsgeld
                    für ein Geschwisterkind bekommen haben, werden die
                    betroffenen Monate automatisch übersprungen. Wenn Sie das
                    nicht wollen, können Sie später im Antrag darauf verzichten.
                  </li>
                  <li>
                    <strong>Bei Selbstständigen: </strong>Hier passiert die
                    Verschiebung nicht automatisch. Sie müssen beantragen, dass
                    der Zeitraum verschoben werden soll.
                  </li>
                </ul>
              </>
            }
          />

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="hatMutterschutzGeschwisterkind"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
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
