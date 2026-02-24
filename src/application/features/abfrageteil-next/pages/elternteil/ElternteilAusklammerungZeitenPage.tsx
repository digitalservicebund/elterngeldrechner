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
    <Page heading="Finanzielle Situation">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Bitte machen Sie Detailangaben</h3>

        {defaultValues["mutterschutz"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="mutterschutz"
            title="Von wann bis wann waren Sie für ein älteres Kind im Mutterschutz?"
            control={control}
            errors={errors}
          />
        )}

        {defaultValues["elterngeld"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="elterngeld"
            title="Von wann bis wann haben Sie Elterngeld für ein älteres Kind bekommen?"
            control={control}
            errors={errors}
          />
        )}

        {defaultValues["erkrankung"].length > 0 && (
          <ElternteilAusklammerungZeitenInput
            grund="erkrankung"
            title="Von wann bis wann waren Sie wegen Ihrer Schwangerschaft krank?"
            control={control}
            errors={errors}
          />
        )}

        <div className="flex gap-16">
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
