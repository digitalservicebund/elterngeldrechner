import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungElternzeitGeschwisterkindAbfrage,
  ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components";
import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung } from "@/application/features/abfrageteil/domain/berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerungNew";
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

export function ElternteilAusklammerungElternzeitAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungElternzeitAbfrage;
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
  const istMutterschutzFuerGeschwisterkindMoeglich = () => {
    if (routeParams.elternteilIndex === 0) return true;

    const ausklammerungenElternteil1 = findeAusklammerungen(eventStream, 0);
    if (
      ausklammerungenElternteil1.some(
        (ausklammerung) =>
          ausklammerung.grund === "mutterschutzGeschwisterkind" &&
          ausklammerung.geschwisterIndex === routeParams.geschwisterIndex,
      )
    )
      return false;

    return true;
  };

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(
      ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema,
    ),
    defaultValues: encodeSafely(
      ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (
    values: ElternteilAusklammerungElternzeitGeschwisterkindAbfrage,
  ) => {
    const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
      berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung(
        geburtsdatum,
        geschwisterkinder,
        [...bisherigeAusklammerungen],
        routeParams.geschwisterIndex,
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

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <div className="text-container">
            <h3>
              Hat {vorname} Elterngeld für {vornameGeschwisterkind} erhalten?
            </h3>

            <p>
              Wenn Sie Elterngeld für ein Geschwisterkind erhalten und weniger
              verdient haben, können wir diese Zeit bei der Berechnung
              überspringen. So wird Ihr Elterngeld auf Basis Ihrer höheren
              Einkünfte berechnet.
            </p>
            <p>
              <strong>Wichtig: </strong>Das gilt nur für Elterngeld, das Sie bis
              zum 14. Lebensmonat des Geschwisterkindes bezogen haben.
            </p>
          </div>

          <InfoText
            question="Warum wird das gefragt?"
            answer={
              <>
                <p>
                  Wenn Sie für ein älteres Kind Elterngeld bekommen haben,
                  hatten Sie in dieser Zeit meist kein oder nur ein geringes
                  Einkommen. Damit Ihr Elterngeld für dieses Kind dadurch nicht
                  sinkt, werden diese Monate bei der Berechnung übersprungen.
                  Wir nutzen stattdessen einen Zeitraum, in dem Sie mehr
                  verdient haben (meist die Zeit vor der Geburt des Kindes).
                </p>

                <p className="font-bold">
                  Was muss ich später für den Antrag beachten?
                </p>
                <ul>
                  <li>
                    <strong>Für Angestellte: </strong>Wenn Sie Elterngeld für
                    ein Geschwisterkind bekommen haben, werden die betroffenen
                    Monate automatisch übersprungen. Wenn Sie das nicht wollen,
                    können Sie später im Antrag darauf verzichten.
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
            name="hatElterngeldGeschwisterkind"
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
