import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAngaben,
  GeschwisterkindAngabenSchema,
} from "./GeschwisterSchema";
import { Button } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { usePageIndex } from "@/application/features/abfrageteil-next/hooks/usePageIndex";
import {
  Route,
  getNextRoute,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function GeschwisterkindAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigeRoute } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAngaben;
  const index = usePageIndex();
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  // const { register, handleSubmit, formState } = useForm({
  const { handleSubmit } = useForm({
    resolver: zodResolver(GeschwisterkindAngabenSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  // const { errors: formErrors } = formState;

  const onSubmit = (values: GeschwisterkindAngaben) => {
    dispatch({
      route: currentRoute,
      params: { index },
      payload: values,
    });

    const nextPath = getNextRoute({
      route: currentRoute,
      params: { index },
      payload: values,
    });

    void navigate(nextPath);
  };

  const navigateBack = () => {
    void navigate(findeVorherigeRoute(currentRoute));
  };

  return (
    <Page heading="" navigationItems={[]} currentNavigationItem="">
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
