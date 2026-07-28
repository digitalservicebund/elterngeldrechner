import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungErkrankungAbfrage,
  ElternteilAusklammerungErkrankungAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components";
import { findeJuengstesRelevantesGeschwisterkind } from "@/application/features/abfrageteil/domain/findeAusklammerungsrelevantesGeschwisterkind";
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

export function ElternteilAusklammerungErkrankungAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungErkrankungAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const geburtsdatum = findeGeburtsdatum(eventStream);
  const geschwisterkinder = findeGeschwisterkinder(eventStream);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(ElternteilAusklammerungErkrankungAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilAusklammerungErkrankungAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: ElternteilAusklammerungErkrankungAbfrage) => {
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      findeJuengstesRelevantesGeschwisterkind(
        geschwisterkinder,
        geburtsdatum,
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

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <div className="text-container">
            <h3>
              War {vorname} wegen dieser Schwangerschaft krankgeschrieben?
            </h3>

            <p>
              Wenn Sie deswegen Krankengeld statt Gehalt erhalten haben, können
              wir diese Monate bei der Berechnung überspringen – Ihr Elterngeld
              basiert dann auf den Monaten mit Ihrem vollen Gehalt. Gemeint ist
              hier nicht das Beschäftigungsverbot.
            </p>
          </div>

          <InfoText
            question="Was heißt krank wegen der Schwangerschaft?"
            answer={
              <>
                <p className="font-bold">Wann ist das wichtig für Sie?</p>
                <p>
                  Eine normale Krankschreibung ändert nichts an Ihrem
                  Elterngeld, solange Ihr Arbeitgeber Ihr volles Gehalt
                  weiterzahlt. Das ist meistens in den ersten 6 Wochen einer
                  Krankheit so.
                </p>

                <p>Diese Frage betrifft Sie nur, wenn:</p>
                <ul>
                  <li>Sie wegen der Schwangerschaft krank waren und</li>
                  <li>
                    Sie in dieser Zeit Krankengeld (und dadurch weniger
                    Einkommen) bekommen haben.
                  </li>
                </ul>
                <p className="italic">
                  Hinweis: Für diese Zeit brauchen Sie später ein ärztliches
                  Attest.
                </p>

                <p className="font-bold">
                  Was heißt krank wegen der Schwangerschaft?
                </p>
                <p>
                  Es zählen nur Krankheiten, bei denen Ihre Frauenärztin oder
                  Ihr Frauenarzt Sie{" "}
                  <strong>
                    wegen Schwangerschafts-Beschwerden krankgeschrieben
                  </strong>{" "}
                  hat.
                </p>
                <ul>
                  <li>
                    <strong>Wichtig: </strong>Sie müssen weniger Einkommen
                    haben. Wenn Sie trotz der Beschwerden Ihr volles Gehalt
                    weiter bekommen haben (z. B. durch ein
                    Beschäftigungsverbot), tragen Sie hier „Nein“ ein.
                  </li>
                  <li>
                    <strong>Andere Krankheiten zählen nicht: </strong>Wenn Sie
                    aus anderen Gründen krankgeschrieben waren (zum Beispiel
                    wegen einer Grippe oder einem gebrochenen Bein), zählen
                    diese Monate gesetzlich nicht als Schwangerschaftsbedingte
                    Erkrankung. Diese Monate dürfen wir nicht verschieben.
                  </li>
                </ul>

                <p className="font-bold">
                  Was bedeutet das für die Berechnung?
                </p>
                <ul>
                  <li>
                    Wenn Sie aufgrund der Schwangerschaft krank waren, lassen
                    wir diese Monate bei der Berechnung weg.
                  </li>
                  <li>
                    Wir nehmen stattdessen Monate davor, in denen Sie Ihr
                    normales Gehalt bekommen haben.
                  </li>
                </ul>

                <p className="font-bold">
                  Was muss ich später für den Antrag beachten?
                </p>
                <ul>
                  <li>
                    <strong>Für Angestellte: </strong>Wenn Ihr Arzt oder Ihre
                    Ärztin bestätigt, dass Sie wegen Ihrer Schwangerschaft krank
                    waren, werden die betroffenen Monate automatisch
                    übersprungen. Wenn Sie das nicht wollen, können Sie später
                    im Antrag darauf verzichten.
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
            name="hatSchwangerschaftsbedingteErkrankung"
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
