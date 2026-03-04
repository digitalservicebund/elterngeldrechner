import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitSelbststaendigAngaben,
  TaetigkeitSelbststaendigAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilTaetigkeitAngabenSelbststaendigPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenSelbststaendig;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(TaetigkeitSelbststaendigAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitSelbststaendigAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: TaetigkeitSelbststaendigAngaben) => {
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

  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum("Selbstaendig");

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
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow="Selbstaendig"
        />

        <div>
          <h3 className="mb-10">Details zur selbstständigen Tätigkeit</h3>

          <p>
            Bitte geben Sie hier Details zu Ihrer Tätigkeit an. Im Anschluss
            haben Sie die Möglichkeit noch eine weitere Tätigkeit anzugeben.
          </p>
        </div>

        <div>
          <h5 className="mb-10">Sind Sie Kirchensteuerpflichtig?</h5>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istKirchensteuerpflichtig"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          <h5 className="mb-10">
            Sind Sie über die gesetzliche Krankenversicherung pflichtversichert?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istGesetzlichKrankenpflichtversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          <h5 className="mb-10">
            Zahlen Sie Pflichtbeiträge in die gesetzliche Rentenversicherung?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istGesetzlichRentenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          <h5 className="mb-10">
            Zahlen Sie Pflichtbeiträge in die gesetzliche
            Arbeitslosenversicherung?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istGesetzlichArbeitlosenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />
        </div>

        <div>
          <h5 className="mb-10">
            Wie viel haben Sie mit Ihrer selbstständigen Arbeit brutto im
            Kalenderjahr {bemessungszeitraum[0]?.von.year} verdient?
          </h5>

          {/* <InfoZuAlleinerziehenden /> */}

          <NumberInput
            {...register("bruttoJahresgewinn", {
              valueAsNumber: true,
              max: {
                value: 175000,
                message:
                  "Sie überschreiten das Maximaleinkommen, um Elterngeld zu bekommen",
              },
              min: { value: 0, message: "Bitte geben Sie ein Einkommen an" },
              required: "Bitte geben Sie ein Einkommen an",
            })}
            label="Brutto-Gewinn im gesamten Kalenderjahr"
            errors={formErrors.bruttoJahresgewinn?.message}
          />
        </div>

        <Alert
          headline="Ihr Einkommenststeuerbescheid für das letzte Jahr liegt noch nicht vor?"
          className="mt-40"
        >
          Wenn der aktuelle Einkommensteuerbescheid noch nicht vorliegt, geben
          Sie einen geschätzten Brutto-Gewinn an. Beachten Sie, dass das
          Ergebnis der Elterngeldberechnung dadurch abweichen kann.
        </Alert>

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
