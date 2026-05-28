import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  WeitereTaetigkeitAbfrage,
  WeitereTaetigkeitAbfrageSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { CustomRadioGroup } from "@/application/features/abfrageteil-next/components/CustomRadioGroup";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAlleinerziehend } from "@/application/features/abfrageteil-next/domain/findeAlleinerziehend";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { useValidierungsfehlerTracking } from "@/application/user-tracking";

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
  const istSelbststaendigeTaetigkeitMoeglich = taetigkeiten.istSelbststaendig;
  const istPersonAlleinerziehend = findeAlleinerziehend(eventStream);

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(WeitereTaetigkeitAbfrageSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = (values: WeitereTaetigkeitAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        istSelbststaendigeTaetigkeitMoeglich,
        istPersonAlleinerziehend,
      },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, routeParams));
  };

  const taetigkeitenFlow =
    taetigkeiten.hatPeriodenOhneEinkommen === false &&
    taetigkeiten.istSelbststaendig === true
      ? "Selbstaendig"
      : "Nicht-Selbstaendig";
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={[]}
          taetigkeitenFlow={taetigkeitenFlow}
        />

        <CustomRadioGroup
          className="mt-16"
          legend=<h3 className="mb-10">
            Hatte {vorname} noch weitere Tätigkeiten im Bemessungszeitraum?
          </h3>
          errors={formErrors}
          register={register}
          name="istWeitereTaetigkeitVorhanden"
          options={[
            {
              value: "yes",
              label: `Ja, ${vorname} hatte eine oder mehrere weitere Tätigkeiten`,
            },
            {
              value: "no",
              label: `Nein, ${vorname} hatte keine weiteren Tätigkeiten`,
            },
          ]}
        >
          <InfoText
            className="mb-16"
            question="Was sind weitere Tätigkeiten?"
            answer={
              <>
                <p>
                  Hier sind alle zusätzlichen Tätigkeiten gemeint, aus denen Sie
                  im Bemessungszeitraum Einkommen bezogen haben.
                </p>

                <p>Dazu zählen:</p>
                <ul>
                  <li>
                    Weitere angestellten Tätigkeiten (auch Teilzeit oder
                    Minijobs)
                  </li>
                  <li>Weiteres Einkommen durch Selbstständigkeit</li>
                </ul>
              </>
            }
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
