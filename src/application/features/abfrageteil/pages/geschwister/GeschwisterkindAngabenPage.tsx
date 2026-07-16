import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useId } from "react";
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
import { useFormWithValidationTracking } from "../../hooks/useFormWithValidationTracking";

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

  const { register, handleSubmit, formState, watch } =
    useFormWithValidationTracking({
      resolver: zodResolver(schema),
      defaultValues: encodeSafely(
        GeschwisterkindAngabenSchema,
        letztesGueltigesEvent,
      ),
    });

  const { errors: formErrors } = formState;

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

  const personNameInputIdentifier = useId();
  const nameInForm = watch("name");
  const vorname =
    nameInForm?.trim() ||
    `Geschwisterkind ${routeParams.geschwisterkindIndex + 1}`;

  const geburtsdatumInputIdentifier = useId();

  return (
    <Page heading="Angaben zu Geschwistern">
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="input-container">
          <h3>
            Wie heißt Geschwisterkind {routeParams.geschwisterkindIndex + 1} mit
            Vornamen?
          </h3>

          <InfoText
            question="Warum soll ich einen Vornamen angeben?"
            answer="Der Vorname hilft Ihnen, in der Planung den Überblick zu behalten. Wenn Sie Ihre Daten später in den Antrag auf Elterngeld übertragen wollen, können wir die Planungsdaten direkt dem richtigen Kind zuordnen."
          />

          <div>
            <label
              className={classNames("block label-small", {
                "!text-danger": formErrors.name,
              })}
              htmlFor={personNameInputIdentifier}
            >
              Vorname
            </label>

            <input
              id={personNameInputIdentifier}
              className={classNames(
                "border border-solid border-grey-dark px-16 py-8 focus-within:outline focus-within:outline-2 focus-within:outline-primary",
                {
                  "!border-danger focus-within:outline-danger": formErrors.name,
                },
              )}
              aria-invalid={!!formErrors.name}
              aria-describedby={
                formErrors.name
                  ? `${personNameInputIdentifier}-error`
                  : undefined
              }
              {...register("name")}
            />

            {!!formErrors.name && (
              <p
                id={`${personNameInputIdentifier}-error`}
                className="mt-8 text-14 text-danger"
              >
                {formErrors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="input-container">
          <h3>Wann wurde {vorname} geboren?</h3>

          <div>
            <label
              className={classNames("label-small", {
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
        </div>

        <CustomRadioGroup
          legend={`Hat ${vorname} eine Behinderung?`}
          errors={formErrors}
          register={register}
          name="hatBehinderung"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Was bedeutet Behinderung?"
            answer="Wenn Sie ein Kind mit Behinderung unter 14 Jahren haben, können Sie den Geschwisterbonus länger erhalten. Der Grad der Behinderung (GdB) muss mindestens 20 betragen und später bei der Beantragung von Elterngeld als Nachweis eingereicht werden."
          />
        </CustomRadioGroup>

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
