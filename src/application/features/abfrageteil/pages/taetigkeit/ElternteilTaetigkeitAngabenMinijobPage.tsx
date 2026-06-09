import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitMinijobEinkommendetailsAbfrage,
  TaetigkeitMinijobEinkommendetailsAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button } from "@/application/features/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil/components/BemessungszeitraumBox";
import { CustomRadioGroup } from "@/application/features/abfrageteil/components/CustomRadioGroup";
import { Page } from "@/application/features/abfrageteil/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil/domain/findeAusklammerungen";
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
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";

export function ElternteilTaetigkeitAngabenMinijobPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenMinijob;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(TaetigkeitMinijobEinkommendetailsAbfrageSchema),
    defaultValues: encodeSafely(
      TaetigkeitMinijobEinkommendetailsAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = async (values: TaetigkeitMinijobEinkommendetailsAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = async () => {
    await navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const taetigkeitenFlow = taetigkeiten.istSelbststaendig
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

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow={taetigkeitenFlow}
        />

        <h3 className="mb-10">
          Details zur Tätigkeit als Angestellte oder Angestellter
        </h3>

        <CustomRadioGroup
          legend=<h5 className="mb-10">
            Hat {vorname} im Bemessungszeitraum immer gleich viel pro Monat
            verdient?
          </h5>
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
