import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  GeschwisterkindAngaben,
  GeschwisterkindAngabenSchema,
  erstelleGeschwisterkindAngabenSchema,
} from "./GeschwisterSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { DateInput } from "@/application/features/abfrageteil/components/DateInput";
import { Page } from "@/application/features/components/Page";
import { findeAnzahlGeschwister } from "@/application/features/abfrageteil/domain/findeAnzahlGeschwister";
import { findeGeburtsdatum } from "@/application/features/abfrageteil/domain/findeGeburtsdatum";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";

export function GeschwisterkindAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAngaben;
  const routeParams = useRouteParams(Route.GeschwisterkindAngaben);

  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const anzahlGeschwister = findeAnzahlGeschwister(eventStream);
  const kindGeburtsdatum = findeGeburtsdatum(eventStream);

  const schema = erstelleGeschwisterkindAngabenSchema(kindGeburtsdatum);

  const { register, handleSubmit, formState, subscribe, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: encodeSafely(
      GeschwisterkindAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = async (values: GeschwisterkindAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        anzahlGeschwisterkinder: anzahlGeschwister,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const geburtsdatum = watch("geburtsdatum");
  const geburtsdatumInputIdentifier = useId();

  return (
    <Page heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3 className="mb-10">
            Wann wurde Geschwisterkind {routeParams.geschwisterkindIndex + 1}{" "}
            geboren?
          </h3>

          <label
            className={classNames("mb-4 mt-20 block text-16", {
              "text-danger": formErrors.geburtsdatum,
            })}
            htmlFor={geburtsdatumInputIdentifier}
          >
            Geburtsdatum (TT.MM.JJJJ)
          </label>

          <DateInput
            id={geburtsdatumInputIdentifier}
            error={formErrors.geburtsdatum?.message}
            {...register("geburtsdatum")}
          />
        </div>

        <CustomRadioGroup
          legend=<h3 className="mb-10">
            Hat das Geschwisterkind{" "}
            {geburtsdatum && geburtsdatum.length > 0
              ? `(geb. ${geburtsdatum})`
              : routeParams.geschwisterkindIndex + 1}{" "}
            eine Behinderung?
          </h3>
          errors={formErrors}
          register={register}
          name="hatBehinderung"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Warum fragen wir das?"
            answer="Wenn Sie ein Kind mit Behinderung unter 14 Jahren haben, können Sie den Geschwisterbonus länger erhalten."
          />
        </CustomRadioGroup>

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
