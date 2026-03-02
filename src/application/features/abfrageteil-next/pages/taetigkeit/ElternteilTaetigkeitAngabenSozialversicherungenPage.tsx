import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitNichtSelbststaendigAngaben,
  TaetigkeitNichtSelbststaendigAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/common";
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
import { Steuerklasse } from "@/elterngeldrechner";

export function ElternteilTaetigkeitAngabenSozialversicherungenPage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitAngabenSozialversicherungen;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(TaetigkeitNichtSelbststaendigAngabenSchema),
    defaultValues: encodeSafely(
      TaetigkeitNichtSelbststaendigAngabenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: TaetigkeitNichtSelbststaendigAngaben) => {
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

  const steuerklasseOptions: SelectOption<Steuerklasse | "">[] = [
    { value: Steuerklasse.I, label: "1" },
    { value: Steuerklasse.II, label: "2" },
    { value: Steuerklasse.III, label: "3" },
    { value: Steuerklasse.IV, label: "4" },
    { value: Steuerklasse.V, label: "5" },
  ];

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
              Bemessungszeitraum: Kalenderjahr {bemessungszeitraum[0]?.von.year}
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

        <h3 className="mb-10">Details zur selbstständigen Tätigkeit</h3>

        <div>
          <h5 className="mb-10">Welche Steuerklasse hatten Sie?</h5>

          <CustomSelect
            autoWidth
            label="Steuerklasse"
            errors={formErrors}
            register={register}
            options={steuerklasseOptions}
            {...register("steuerklasse")}
          />
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
            Wie haben Sie von Juni 2024 - Mai 2025 im Monat brutto verdient?
          </h5>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istEinkommenGleichVerteilt"
            options={[
              {
                value: "yes",
                label: "Ich habe jeden Monat gleich viel verdient",
              },
              { value: "no", label: "Ich habe unterschiedlich viel verdient" },
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
