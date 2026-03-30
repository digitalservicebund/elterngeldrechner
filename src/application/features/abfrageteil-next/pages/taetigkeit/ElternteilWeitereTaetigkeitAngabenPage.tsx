import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  WeitereTaetigkeitArtAbfrage,
  WeitereTaetigkeitArtAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button } from "@/application/components";
import { CustomRadioGroup } from "@/application/features/abfrageteil-next/components/CustomRadioGroup";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilWeitereTaetigkeitAngabenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilWeitereTaetigkeitAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(WeitereTaetigkeitArtAbfrageSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitArtAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: WeitereTaetigkeitArtAbfrage) => {
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

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <CustomRadioGroup
          legend=<h3 className="mb-10">
            Um was handelt oder handelte es sich bei der weiteren Tätigkeit?
          </h3>
          errors={formErrors}
          register={register}
          name="istWeitereTaetigkeitSelbststaendigeTaetigkeit"
          options={[
            {
              value: "no",
              label: "",
              description: (id) => (
                <div id={id}>
                  <p className="font-bold">{vorname} war oder ist angestellt</p>
                  <p>
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
                  <p className="font-bold">
                    {vorname} war oder ist selbstständig
                  </p>
                  <p>
                    zum Beispiel Gewerbe (Online-Shop, Handwerk, Handel), Land-
                    oder Forstwirtschaft, Freiberuflichkeit, Selbstständig (GbR,
                    GmbH, Beteiligung).
                  </p>
                </div>
              ),
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
