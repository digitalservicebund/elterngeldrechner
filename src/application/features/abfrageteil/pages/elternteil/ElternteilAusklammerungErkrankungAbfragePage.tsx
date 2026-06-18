import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungErkrankungAbfrage,
  ElternteilAusklammerungErkrankungAbfrageSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components";
import { berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung } from "@/application/features/abfrageteil/domain/berechneNächstenGeschwisterIndexMitRelevanzFuerAusklammerung";
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

export function ElternteilAusklammerungErkrankungAbfragePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

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

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilAusklammerungErkrankungAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilAusklammerungErkrankungAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: ElternteilAusklammerungErkrankungAbfrage) => {
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

  const navigateBack = async () => {
    await navigate(findeVorherigenPfad(currentRoute, routeParams));
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
          <h3>War {vorname} wegen dieser Schwangerschaft krank?</h3>

          <p className="mb-32">
            Wenn Sie wegen dieser Schwangerschaft krank waren und weniger
            verdient haben, können wir diese Zeit bei der Berechnung
            überspringen. So wird Ihr Elterngeld auf Basis Ihrer höheren
            Einkünfte berechnet.
          </p>

          <InfoText
            question="Warum wird das gefragt?"
            answer={
              <>
                <p>
                  Wir berechnen Ihr Elterngeld nach Ihrem Einkommen. Geld von
                  der Krankenkasse (Krankengeld) zählt nicht als Einkommen.
                  Würde man dieses bei der Berechnung berücksichtigen, könnte
                  das Ihr Elterngeld verringern.
                </p>

                <p className="mb-0 mt-20">
                  Wenn Sie aber aufgrund der Schwangerschaft krank waren, ist
                  das anders:
                </p>
                <ul>
                  <li>Wir lassen diese Monate bei der Berechnung weg.</li>
                  <li>
                    Wir nehmen stattdessen Monate von davor, in denen Sie Ihr
                    normales Gehalt bekommen haben.
                  </li>
                </ul>

                <p className="mt-20">
                  <strong>Wichtig: </strong>Das gilt nur bei Krankheit aufgrund
                  der Schwangerschaft. Wenn Sie aus anderen Gründen krank waren
                  (zum Beispiel wegen eines gebrochenen Beins), dürfen wir den
                  Zeitraum nicht verschieben. Ein Beschäftigungsverbot in der
                  Schwangerschaft zählt auch nicht als Krankheit, weil Sie
                  währenddessen keine finanziellen Einbußen haben.
                </p>

                <p className="mb-0 mt-20 font-bold">
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
        </div>

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
