import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  WeitereTaetigkeitArtAbfrage,
  WeitereTaetigkeitArtAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

export function ElternteilWeitereTaetigkeitAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilWeitereTaetigkeitAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(WeitereTaetigkeitArtAbfrageSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitArtAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: WeitereTaetigkeitArtAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const eventStream = filtereValideEventHistorie();
  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <CustomRadioGroup
          legend="Um was handelt oder handelte es sich bei der weiteren Tätigkeit?"
          errors={formErrors}
          register={register}
          name="istWeitereTaetigkeitSelbststaendigeTaetigkeit"
          options={[
            {
              value: "no",
              label: "",
              description: (id) => (
                <div id={id}>
                  <p className="mt-0 font-bold">
                    {vorname} war oder ist angestellt
                  </p>
                  <p className="mt-0">
                    zum Beispiel in Vollzeit, Teilzeit, als Minijob, in
                    Ausbildung, Freiwilligendienst.
                  </p>
                </div>
              ),
            },
            {
              value: "yes",
              label: "",
              description: (id) => (
                <div id={id}>
                  <p className="mt-0 font-bold">
                    {vorname} war oder ist selbstständig
                  </p>
                  <p className="mt-0">
                    zum Beispiel Gewerbe (Online-Shop, Handwerk, Handel), Land-
                    oder Forstwirtschaft, Freiberuflichkeit, Selbstständig (GbR,
                    GmbH, Beteiligung).
                  </p>
                </div>
              ),
            },
          ]}
        />

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
