import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Geburt, GeburtSchema } from "./KindSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { generateAbfrageteilPath } from "@/application/features/abfrageteil-next/routing/routeDefinition";
import {
  FormEvent,
  getNextRoute,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function KindPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigeRoute } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.KindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeburtSchema),
    defaultValues: encodeSafely(GeburtSchema, letztesGueltigesEvent),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: Geburt) => {
    const event: FormEvent = { route: currentRoute, payload: values };

    dispatch(event);

    void navigate(generateAbfrageteilPath(getNextRoute(event)));
  };

  const navigateBack = () => {
    void navigate(generateAbfrageteilPath(findeVorherigeRoute(currentRoute)));
  };

  return (
    <Page heading="Angaben zum Kind">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">Ist ihr Kind schon geboren?</h3>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istGeboren"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

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
