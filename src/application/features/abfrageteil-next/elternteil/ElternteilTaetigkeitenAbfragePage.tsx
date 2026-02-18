import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilTaetigkeitenAbfrage,
  ElternteilTaetigkeitenAbfrageSchema,
} from "./ElternteilSchema";
import { Button } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useElternteilIndex } from "@/application/features/abfrageteil-next/hooks/usePageIndex";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  FormEvent,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilTaetigkeitenAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenAbfrage;
  const elternteilIndex = useElternteilIndex();
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute, {
    elternteilIndex,
  });

  // const { register, handleSubmit, formState } = useForm({
  const { handleSubmit } = useForm({
    resolver: zodResolver(ElternteilTaetigkeitenAbfrageSchema),
    defaultValues: encodeSafely(
      ElternteilTaetigkeitenAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  // const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilTaetigkeitenAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: { elternteilIndex },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, { elternteilIndex }));
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
