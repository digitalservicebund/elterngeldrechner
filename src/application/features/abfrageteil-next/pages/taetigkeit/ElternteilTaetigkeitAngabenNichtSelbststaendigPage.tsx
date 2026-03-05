import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitNichtSelbststaendigMinijobAbfrage,
  TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilTaetigkeitAngabenNichtSelbststaendigPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(TaetigkeitNichtSelbststaendigMinijobAbfrageSchema),
    defaultValues: encodeSafely(
      TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: TaetigkeitNichtSelbststaendigMinijobAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const taetigkeitenFlow =
    taetigkeiten.hatKeinEinkommen === false &&
    taetigkeiten.istSelbststaendig === true
      ? "Selbstaendig"
      : "Nicht-Selbstaendig";
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  return (
    <Page heading="Finanzielle Situation [Person]">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow={taetigkeitenFlow}
        />

        <div>
          <h3 className="mb-10">
            Details zur Tätigkeit als Angestellte oder Angestellter
          </h3>

          <p>
            Bitte geben Sie hier Details zur Tätigkeit von [Name Person 1] an.
            Im Anschluss haben Sie die Möglichkeit, noch eine weitere Tätigkeit
            anzugeben.
          </p>
        </div>

        <div>
          <h5 className="mb-10">
            Handelt es sich um Einkommen aus einem Minijob?
          </h5>

          <InfoText
            question="Was ist ein Minijob?"
            answer={
              <>
                <p>
                  Ein Minijob ist eine Arbeit, bei der man nur wenig verdient.
                </p>
                <p>
                  Man darf im Monat nicht mehr als die gesetzlich festgelegte
                  Grenze verdienen.
                </p>

                <p className="mt-16">Diese Grenze liegt:</p>
                <ul className="mb-16 list-inside list-disc">
                  <li>seit 2025 bei 556 Euro im Monat,</li>
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

          <CustomRadioGroup
            className="mt-16"
            legend=""
            errors={formErrors}
            register={register}
            name="istTaetigkeitMinijob"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
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
