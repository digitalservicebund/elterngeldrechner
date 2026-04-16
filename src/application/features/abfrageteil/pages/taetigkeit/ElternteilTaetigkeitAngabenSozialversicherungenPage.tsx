import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
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
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";

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

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(TaetigkeitNichtSelbststaendigAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitNichtSelbststaendigAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  useValidierungsfehlerTracking(subscribe);

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
  const taetigkeitenFlow = taetigkeiten.istSelbststaendig
    ? "Selbstaendig"
    : "Nicht-Selbstaendig";
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
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 className="mb-10">
            Details zur Tätigkeit als Angestellte oder Angestellter
          </h3>

          <BemessungszeitraumKurzuebersicht
            bemessungszeitraum={bemessungszeitraum}
            taetigkeitenFlow={taetigkeitenFlow}
          />

          <p className="mt-32">
            Je genauer Ihre Angaben sind, desto besser kann der Rechner das
            Elterngeld für Sie ausrechnen.
          </p>
        </div>

        <div>
          <h5 className="mb-10">Welche Steuerklasse hatte {vorname}?</h5>

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
          legend={
            <h5 className="mb-10">Ist {vorname} kirchensteuerpflichtig?</h5>
          }
          errors={formErrors}
          register={register}
          name="istKirchensteuerpflichtig"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        />

        <CustomRadioGroup
          className="mt-16"
          legend={
            <h5 className="mb-10">
              Ist {vorname} über die gesetzliche Krankenversicherung
              pflichtversichert?
            </h5>
          }
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
                <p className="mb-16">
                  Wenn Sie angestellt sind, gilt für Sie in den meisten Fällen
                  die gesetzliche Pflichtversicherung.
                </p>

                <p>Sie wählen „Nein“, wenn Sie</p>
                <ul className="mb-16">
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
          className="mt-16"
          legend={
            <h5 className="mb-10">
              Zahlt {vorname} Pflichtbeiträge in die gesetzliche
              Rentenversicherung?
            </h5>
          }
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
                <p className="mb-16">
                  Wenn Sie angestellt sind, zahlen Sie in der Regel automatisch
                  Pflichtbeiträge zur gesetzlichen Rentenversicherung.
                </p>

                <p>
                  Sie wählen „Nein“, wenn Sie keine Pflichtbeiträge zahlen, zum
                  Beispiel weil Sie:
                </p>
                <ul className="mb-16">
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
          className="mt-16"
          legend={
            <h5 className="mb-10">
              Zahlt {vorname} Pflichtbeiträge in die gesetzliche
              Arbeitslosenversicherung?
            </h5>
          }
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
                <p className="mb-16">
                  Wenn Sie angestellt sind, zahlen Sie in der Regel automatisch
                  Pflichtbeiträge zur gesetzlichen Arbeitslosenversicherung.
                </p>

                <p>
                  Sie wählen „Nein“, wenn Sie keine Pflichtbeiträge zahlen, zum
                  Beispiel weil Sie:
                </p>
                <ul className="mb-16">
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
            legend={
              <h5 className="mb-10">
                Hat {vorname} im Bemessungszeitraum immer gleich viel pro Monat
                verdient?
              </h5>
            }
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
          />
        ) : (
          <input
            type="hidden"
            {...register("istEinkommenGleichVerteilt")}
            value="no"
          />
        )}

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
