import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungMutterschutzGeschwisterkindAbfrage,
  ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
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

export function ElternteilAusklammerungMutterschutzAbfragePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungMutterschutzAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

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

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(
      ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
    ),
    defaultValues: encodeSafely(
      ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (
    values: ElternteilAusklammerungMutterschutzGeschwisterkindAbfrage,
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
            Hat {vorname} Mutterschaftsgeld für das Geschwisterkind (geb.{" "}
            {geburtsdatumGeschwisterkind}) erhalten?
          </h3>

          <p className="mb-32">
            Wenn Sie Mutterschaftsgeld für ein Geschwisterkind erhalten haben,
            können wir diese Zeit bei der Berechnung überspringen. So wird Ihr
            Elterngeld auf Basis Ihrer höheren Einkünfte berechnet.
          </p>

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
                  bekommen mitzählen, bekämen Sie für dieses Kind weniger
                  Elterngeld.
                </p>
                <p>
                  Deshalb „überspringen" wir diese Monate. Wir schauen
                  stattdessen weiter zurück in die Vergangenheit auf Monate, in
                  denen Sie mehr Einkommen hatten.
                </p>

                <p className="mb-0 mt-20 font-bold">
                  Was ist Mutterschaftsgeld?
                </p>
                <p className="mb-0">
                  Der Anspruch auf Mutterschaftsleistungen besteht grundsätzlich
                  in den letzten 6 Wochen vor der Geburt, am Tag der Entbindung
                  und 8 Wochen nach der Geburt (Schutzfristen).
                </p>
                <p className="mb-0">
                  Während der Mutterschutzfrist bekommen Sie:
                </p>
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

                <p className="mb-0 mt-20 font-bold">
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
        </div>

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
