import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  GeschwisterkindAngaben,
  GeschwisterkindAngabenSchema,
} from "./GeschwisterSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function GeschwisterkindAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAngaben;
  const routeParams = useRouteParams(Route.GeschwisterkindAngaben);

  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeschwisterkindAngabenSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: GeschwisterkindAngaben) => {
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

  const geburtsdatumInputIdentifier = useId();

  return (
    <Page heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">Wann wurde das Geschwisterkind geboren?</h3>

          <label
            className="mb-4 mt-20 block text-16"
            htmlFor={geburtsdatumInputIdentifier}
          >
            Geburtsdatum (TT.MM.JJJJ)
          </label>

          <DateInput
            id={geburtsdatumInputIdentifier}
            error={formErrors.geburtsdatum?.message}
            aria-describedby={geburtsdatumInputIdentifier}
            {...register("geburtsdatum")}
          />
        </div>

        <div>
          <h3 className="mb-10">Hat das Geschwisterkinder eine Behinderung?</h3>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="hatBehinderung"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          <h3 className="mb-10">
            Gibt es noch ein weiteres Geschwisterkinder?
          </h3>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istWeiteresGeschwisterkindVorhanden"
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
