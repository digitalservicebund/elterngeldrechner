import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitNichtSelbststaendigMinijobAbfrage,
  TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { BemessungszeitraumKurzuebersicht } from "@/application/features/abfrageteil/components/BemessungszeitraumKurzuebersicht";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function ElternteilTaetigkeitAngabenNichtSelbststaendigPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(TaetigkeitNichtSelbststaendigMinijobAbfrageSchema),
    defaultValues: encodeSafely(
      TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (
    values: TaetigkeitNichtSelbststaendigMinijobAbfrage,
  ) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        kannDurchschnittAngegebenWerden,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  const kannDurchschnittAngegebenWerden =
    !taetigkeiten.hatPeriodenOhneEinkommen && !taetigkeiten.hatAndereLeistungen;
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="text-container">
          <h3>Details zur Tätigkeit als Angestellte oder Angestellter</h3>

          <p>
            Wir fragen nun nacheinander Ihre Tätigkeit oder Tätigkeiten ab für
            den
          </p>

          <BemessungszeitraumKurzuebersicht
            bemessungszeitraum={bemessungszeitraum}
            taetigkeitenFlow={taetigkeitenFlow}
          />

          <p>
            Je genauer Ihre Angaben sind, desto besser kann der Rechner das
            Elterngeld für Sie ausrechnen.
          </p>
        </div>

        <CustomRadioGroup
          legend="Handelt es sich um Einkommen aus einem Minijob?"
          errors={formErrors}
          register={register}
          name="istTaetigkeitMinijob"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Was ist ein Minijob?"
            answer={
              <>
                <p>
                  Ein Minijob ist eine Arbeit, bei der man nur wenig verdient.
                  Man darf im Monat nicht mehr als die gesetzlich festgelegte
                  Grenze verdienen.
                </p>

                <p>Diese Grenze liegt:</p>
                <ul>
                  <li>seit 2026 bei 603 Euro im Monat,</li>
                  <li>im Jahr 2025 bei 556 Euro im Monat,</li>
                  <li>im Jahr 2024 bei 538 Euro im Monat,</li>
                  <li>von Oktober 2022 bis Ende 2023 bei 520 Euro im Monat,</li>
                  <li>davor bei 450 Euro im Monat.</li>
                </ul>

                <p>
                  Beim Minijob fallen meist keine Steuern und Sozialabgaben an.
                  Deshalb zieht die Elterngeldstelle von diesem Einkommen auch
                  nichts ab. Es wird mit dem vollen Betrag gerechnet, den man
                  verdient hat.
                </p>
              </>
            }
          />
        </CustomRadioGroup>

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
