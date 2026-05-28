import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import {
  ElternteilAusklammerungZeiten,
  ElternteilAusklammerungZeitenSchema,
} from "./ElternteilSchema";
import { erstelleAusklammerungZeitenDefaultValues } from "./erstelleAusklammerungZeitenDefaultValues";
import { Button } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import { ElternteilAusklammerungZeitenInput } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilAusklammerungZeitenInput";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { useValidierungsfehlerTracking } from "@/application/user-tracking";

export type ElternteilAusklammerungszeitenInput = z.input<
  typeof ElternteilAusklammerungZeitenSchema
>;

export type ElternteilAusklammerungszeitenOutput = z.output<
  typeof ElternteilAusklammerungZeitenSchema
>;

export function ElternteilAusklammerungZeitenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungZeitenAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const aktuellesAusklammerungsGruendeEvent = findeLetztesGueltigesEvent(
    Route.ElternteilAusklammerungGruendeAngaben,
    routeParams,
  );

  // TODO: noValidate for native form validation
  // TODO: Filter non-empty inputs before submit

  const defaultValues = erstelleAusklammerungZeitenDefaultValues(
    encodeSafely(ElternteilAusklammerungZeitenSchema, letztesGueltigesEvent),
    aktuellesAusklammerungsGruendeEvent,
  );

  const {
    handleSubmit,
    control,
    subscribe,
    formState: { errors },
  } = useForm<
    ElternteilAusklammerungszeitenInput,
    undefined,
    ElternteilAusklammerungszeitenOutput
  >({
    resolver: zodResolver(ElternteilAusklammerungZeitenSchema),
    defaultValues,
  });

  const onSubmit = (values: ElternteilAusklammerungZeiten) => {
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
  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  useValidierungsfehlerTracking(subscribe);

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h3>Bitte machen Sie Detailangaben:</h3>

        {defaultValues["mutterschutzGeschwisterkind"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="mutterschutzGeschwisterkind"
            title={`Von wann bis wann war ${vorname} im Mutterschutz für ein älteres Kind?`}
            control={control}
            errors={errors}
          />
        )}

        {defaultValues["elterngeldGeschwisterkind"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="elterngeldGeschwisterkind"
            title={`Von wann bis wann hat ${vorname} Elterngeld für ein älteres Kind (maximal 14 Monate alt) bekommen?`}
            control={control}
            errors={errors}
          />
        )}

        {defaultValues["erkrankungSchwangerschaft"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="erkrankungSchwangerschaft"
            title={`Von wann bis wann war ${vorname} wegen der Schwangerschaft krank?`}
            control={control}
            errors={errors}
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
