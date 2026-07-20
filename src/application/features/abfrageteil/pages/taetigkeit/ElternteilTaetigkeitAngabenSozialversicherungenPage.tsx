import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitNichtSelbststaendigAngaben,
  TaetigkeitNichtSelbststaendigAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/CustomSelect";
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
import { Steuerklasse } from "@/elterngeldrechner";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function ElternteilTaetigkeitAngabenSozialversicherungenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenSozialversicherungen;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(TaetigkeitNichtSelbststaendigAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitNichtSelbststaendigAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: TaetigkeitNichtSelbststaendigAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: {
        ...values,
        istEinkommenGleichVerteilt: kannDurchschnittAngegebenWerden
          ? values.istEinkommenGleichVerteilt
          : false,
      },
      params: routeParams,
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

  const steuerklasseOptions: SelectOption<Steuerklasse | "">[] = [
    { value: Steuerklasse.I, label: "1" },
    { value: Steuerklasse.II, label: "2" },
    { value: Steuerklasse.III, label: "3" },
    { value: Steuerklasse.IV, label: "4" },
    { value: Steuerklasse.V, label: "5" },
  ];

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

        <div className="content-container">
          <div className="input-container">
            <h3>Welche Steuerklasse hatte {vorname}?</h3>

            <InfoText
              question="Welche Steuerklasse gebe ich an?"
              answer={
                <>
                  <p>
                    Ihre Steuerklasse finden Sie auf Ihrer monatlichen
                    Gehaltsabrechnung. In der Regel teilt sie sich so auf:
                  </p>
                  <ul>
                    <li>
                      Steuerklasse 1: Wenn Sie nicht verheiratet oder geschieden
                      sind.
                    </li>
                    <li>Steuerklasse 2: Wenn Sie alleinerziehend sind.</li>
                    <li>
                      Steuerklasse 3, 4 oder 5: Wenn Sie verheiratet sind oder
                      in einer eingetragenen Lebenspartnerschaft leben (als
                      Kombination 3 und 5 oder 4 und 4).
                    </li>
                  </ul>
                  <p className="font-bold">
                    Haben Sie Ihre Steuerklasse gewechselt?
                  </p>
                  <p>
                    Wenn Sie oder Ihr Partner im Zeitraum vor der Geburt (im
                    sogenannten Bemessungszeitraum) die Steuerklasse gewechselt
                    haben, gilt eine einfache Regel: Geben Sie die Steuerklasse
                    an, die Sie in diesem Zeitraum am längsten hatten.
                  </p>
                </>
              }
            />

            <CustomSelect
              autoWidth
              label="Steuerklasse"
              errors={formErrors}
              register={register}
              options={steuerklasseOptions}
              {...register("steuerklasse")}
            />
          </div>

          <CustomRadioGroup
            legend={`Ist ${vorname} kirchensteuerpflichtig?`}
            errors={formErrors}
            register={register}
            name="istKirchensteuerpflichtig"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />

          <CustomRadioGroup
            legend={`Ist ${vorname} über die gesetzliche Krankenversicherung
                pflichtversichert?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichKrankenpflichtversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer={
                <>
                  <p>
                    Wenn Sie angestellt sind, gilt für Sie in den meisten Fällen
                    die gesetzliche Pflichtversicherung.
                  </p>

                  <p>Sie wählen „Nein“, wenn Sie</p>
                  <ul>
                    <li>freiwillig gesetzlich versichert,</li>
                    <li>familienversichert,</li>
                    <li>privat versichert, </li>
                    <li>nicht (in Deutschland) krankenversichert sind.</li>
                  </ul>

                  <p>
                    Wenn Ihr regelmäßiges Jahresbrutto über der gesetzlich
                    festgelegten Einkommensgrenze liegt, sind Sie in der Regel
                    nicht mehr gesetzlich pflichtversichert.
                  </p>
                </>
              }
            />
          </CustomRadioGroup>

          <CustomRadioGroup
            legend={`Zahlt ${vorname} Pflichtbeiträge in die gesetzliche
                Rentenversicherung?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichRentenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer={
                <>
                  <p>
                    Wenn Sie angestellt sind, zahlen Sie in der Regel
                    automatisch Pflichtbeiträge zur gesetzlichen
                    Rentenversicherung.
                  </p>

                  <p>
                    Sie wählen „Nein“, wenn Sie keine Pflichtbeiträge zahlen,
                    zum Beispiel weil Sie:
                  </p>
                  <ul>
                    <li>verbeamtet sind,</li>
                    <li>selbstständig tätig sind,</li>
                    <li>
                      geringfügig beschäftigt (Minijob ohne
                      Rentenversicherungspflicht) sind,
                    </li>
                    <li>
                      oder aus anderen Gründen von der Versicherungspflicht
                      befreit wurden.
                    </li>
                  </ul>
                </>
              }
            />
          </CustomRadioGroup>

          <CustomRadioGroup
            legend={`Zahlt ${vorname} Pflichtbeiträge in die gesetzliche
                Arbeitslosenversicherung?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichArbeitlosenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer={
                <>
                  <p>
                    Wenn Sie angestellt sind, zahlen Sie in der Regel
                    automatisch Pflichtbeiträge zur gesetzlichen
                    Arbeitslosenversicherung.
                  </p>

                  <p>
                    Sie wählen „Nein“, wenn Sie keine Pflichtbeiträge zahlen,
                    zum Beispiel weil Sie:
                  </p>
                  <ul>
                    <li>verbeamtet sind,</li>
                    <li>selbstständig tätig sind,</li>
                    <li>
                      geringfügig beschäftigt (Minijob ohne
                      Rentenversicherungspflicht) sind,
                    </li>
                    <li>
                      oder aus anderen Gründen von der Versicherungspflicht
                      befreit wurden.
                    </li>
                  </ul>
                </>
              }
            />
          </CustomRadioGroup>

          {kannDurchschnittAngegebenWerden ? (
            <CustomRadioGroup
              legend={`Hat ${vorname} immer gleich viel pro Monat
                  verdient?`}
              errors={formErrors}
              register={register}
              name="istEinkommenGleichVerteilt"
              options={[
                {
                  value: "yes",
                  label: `Ja, ${vorname} hat jeden Monat gleich viel verdient`,
                },
                {
                  value: "no",
                  label: `Nein, ${vorname} hat unterschiedlich viel verdient`,
                },
              ]}
            >
              <div className="input-container">
                <div className="text-container">
                  <p className="mt-0">
                    Einmalzahlungen (wie Weihnachtsgeld) zählen hier nicht als
                    unterschiedlich. Es geht nur um das regelmäßige, laufende
                    Gehalt.
                  </p>
                  <p>
                    Beachten Sie: Je genauer Ihre Angaben sind, desto besser
                    kann der Rechner das Elterngeld für Sie berechnen.
                  </p>
                </div>

                <InfoText
                  question="Was bedeutet immer gleich viel verdient?"
                  answer={
                    <>
                      <p>
                        Wählen Sie gleich viel verdient, wenn Sie immer das
                        gleiche feste Bruttogehalt oder den gleichen Stundenlohn
                        hatten.
                      </p>
                      <p>
                        Wählen Sie unterschiedlich viel verdient, wenn sich das
                        monatliche Gehalt verändert hat (zum Beispiel durch eine
                        Gehaltserhöhung oder einen Jobwechsel).
                      </p>
                      <p className="font-bold">
                        Wichtig – Sonderzahlungen zählen nicht mit.
                      </p>
                      <p>
                        Für die Berechnung des Elterngeldes werden keine
                        Einmalzahlungen berücksichtigt. Bitte lassen Sie
                        folgende Zahlungen außer Acht, zum Beispiel:
                      </p>
                      <ul>
                        <li>
                          Weihnachtsgeld, Urlaubsgeld oder ein 13. oder 14.
                          Monatsgehalt
                        </li>
                        <li>
                          Einmalige Boni, Provisionen, Tantiemen oder
                          Abfindungen
                        </li>
                      </ul>
                    </>
                  }
                />
              </div>
            </CustomRadioGroup>
          ) : (
            <input
              type="hidden"
              {...register("istEinkommenGleichVerteilt")}
              value="no"
            />
          )}
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
