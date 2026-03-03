import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { WeitereTaetigkeitAbfrageSchema } from "./TaetigkeitSchema";
import { Button, CustomRadioGroup } from "@/application/components";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAlleinerziehend } from "@/application/features/abfrageteil-next/domain/findeAlleinerziehend";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilWeitereTaetigkeitAbfragePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilWeitereTaetigkeitAbfrage;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const istSelbststaendigeTaetigkeitMoeglich =
    taetigkeiten.hatKeinEinkommen === false &&
    taetigkeiten.istSelbststaendig === true;
  const istPersonAlleinerziehend = findeAlleinerziehend(eventStream);

  const WeitereTaetigkeitAbfrageFormValuesSchema =
    WeitereTaetigkeitAbfrageSchema.omit({
      istSelbststaendigeTaetigkeitMoeglich: true,
      istPersonAlleinerziehend: true,
    });
  type WeitereTaetigkeitAbfrageFormValues = z.infer<
    typeof WeitereTaetigkeitAbfrageFormValuesSchema
  >;

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(WeitereTaetigkeitAbfrageFormValuesSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: WeitereTaetigkeitAbfrageFormValues) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: {
        ...values,
        istSelbststaendigeTaetigkeitMoeglich,
        istPersonAlleinerziehend,
      },
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
        </div>

        <div>
          <h3 className="mb-10">
            Hatten Sie noch weitere Tätigkeiten im Bemessungszeitraum?
          </h3>

          {/* <InfoZuAlleinerziehenden /> */}

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            name="istWeitereTaetigkeitVorhanden"
            options={[
              {
                value: "yes",
                label: "Ja, ich hatte eine weiteren Tätigkeiten",
              },
              {
                value: "no",
                label: "Nein, ich hatte keine weiteren Tätigkeiten",
              },
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
