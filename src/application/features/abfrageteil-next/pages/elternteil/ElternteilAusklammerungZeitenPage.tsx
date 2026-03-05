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
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import { ElternteilAusklammerungZeitenInput } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilAusklammerungZeitenInput";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export type ElternteilAusklammerungszeitenInput = z.input<
  typeof ElternteilAusklammerungZeitenSchema
>;

export type ElternteilAusklammerungszeitenOutput = z.output<
  typeof ElternteilAusklammerungZeitenSchema
>;

export function ElternteilAusklammerungZeitenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

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

  return (
    <Page heading="Angaben [Person]">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Bitte machen Sie Detailangaben:</h3>

        {/* TODO: Mutterschutz zu Label und Button hinzufügen */}
        {defaultValues["mutterschutzGeschwisterkind"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="mutterschutzGeschwisterkind"
            title="Von wann bis wann war [Person] im Mutterschutz für ein älteres Kind?"
            control={control}
            errors={errors}
          />
        )}

        {/* TODO: Mutterschutz zu Button hinzufügen */}
        {defaultValues["elterngeldGeschwisterkind"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="elterngeldGeschwisterkind"
            title="Von wann bis wann hat [Person] Elterngeld für ein älteres Kind (maximal 14 Monate alt) bekommen?"
            control={control}
            errors={errors}
          />
        )}

        {/* TODO: Mutterschutz zu Button hinzufügen */}
        {defaultValues["erkrankungSchwangerschaft"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="erkrankungSchwangerschaft"
            title="Von wann bis wann war [Person] wegen der Schwangerschaft krank?"
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
