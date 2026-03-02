import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitGleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button } from "@/application/components";
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
// import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilTaetigkeitAngabenEinkommenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenEinkommen;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(TaetigkeitGleichesEinkommenAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitGleichesEinkommenAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: TaetigkeitGleichesEinkommenAngaben) => {
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

  // const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
  //   routeParams.elternteilIndex,
  // );
  // const bemessungszeitraum = berechneBemessungszeitraum("Nicht-Selbstaendig");

  const eventStream = filtereValideEventHistorie();
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );

  return (
    <Page heading="Finanzielle Situation">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-20">
          <div className="rounded bg-grey-light py-10">
            <span className="text-18 px-20 font-bold">
              Bemessungszeitraum: {}
            </span>
          </div>
          {ausklammerungen.length > 0 ? (
            <div className="rounded-b border-x border-b border-t-0 border-dashed border-grey p-20">
              <h5 className="text-14">Übersprungene Zeiträume:</h5>
              <ul className="ml-32 mt-4 list-disc text-14">
                {ausklammerungen
                  ? ausklammerungen.map((ausklammerung) => (
                      <li key={ausklammerung.von.toString()} className="m-0">
                        {ausklammerung.grund} {ausklammerung.von.toString()} bis{" "}
                        {ausklammerung.bis.toString()}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          ) : null}
        </div>

        <h3 className="mb-10">Details zur angestellten Tätigkeit</h3>

        <div>
          <h5 className="mb-10">
            Wie viel haben Sie von Juni 2024 - Mai 2025 im Monat brutto
            verdient?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          <NumberInput
            {...register("monatsbrutto", {
              valueAsNumber: true,
              max: {
                value: 15000,
                message:
                  "Sie überschreiten das Maximaleinkommen, um Elterngeld zu bekommen",
              },
              min: { value: 0, message: "Bitte geben Sie ein Einkommen an" },
              required: "Bitte geben Sie ein Einkommen an",
            })}
            label="Monatliches Brutto-Einkommen"
            errors={formErrors.monatsbrutto?.message}
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
