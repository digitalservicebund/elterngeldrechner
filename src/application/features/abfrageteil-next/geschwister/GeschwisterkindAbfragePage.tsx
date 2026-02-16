import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAbfrageSchema,
} from "./GeschwisterSchema";
import { Button } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { generateAbfrageteilPath } from "@/application/features/abfrageteil-next/routing/routeDefinition";
import {
  FormEvent,
  getNextRoute,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function GeschwisterkindAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigeRoute } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  // const { register, handleSubmit, formState } = useForm({
  const { handleSubmit } = useForm({
    resolver: zodResolver(GeschwisterkindAbfrageSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  // const { errors: formErrors } = formState;

  const onSubmit = (values: GeschwisterkindAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
    };

    dispatch(event);

    void navigate(generateAbfrageteilPath(getNextRoute(event)));
  };

  const navigateBack = () => {
    void navigate(findeVorherigeRoute(currentRoute));
  };

  return (
    <Page heading="">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          {/* <h3 className="mb-10"></h3> */}

          {/* input */}
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
