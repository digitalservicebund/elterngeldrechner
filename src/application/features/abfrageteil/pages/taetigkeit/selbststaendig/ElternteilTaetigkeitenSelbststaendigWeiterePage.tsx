import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  WeitereTaetigkeitAbfrage,
  WeitereTaetigkeitAbfrageSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeTaetigkeiten } from "@/application/features/abfrageteil/domain/findeTaetigkeiten";
import { bestimmeTaetigkeitenFlow } from "@/application/features/abfrageteil/domain/bestimmeTaetigkeitenFlow";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
import { sindBeideElternteile } from "@/application/features/abfrageteil/domain/sindBeideElternteile";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil/hooks/useBemessungszeitraumrechner";
import { useRouteParams } from "@/application/features/abfrageteil/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useFormWithValidationTracking } from "@/application/features/abfrageteil/hooks/useFormWithValidationTracking";
import {
  formatiereKardinalzahlAlsWort,
  formatiereOrdnungszahlAlsWort,
} from "@/application/features/abfrageteil/pages/taetigkeit/formatiereZahlwoerter";
import { ElternteilTaetigkeitenUebersichtsBox } from "../ElternteilTaetigkeitenUebersichtsBox";

export function ElternteilTaetigkeitenSelbststaendigWeiterePage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenSelbststaendigWeitere;
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
  const wirdZweitePersonBeruecksichtigt = sindBeideElternteile(eventStream);

  const { register, handleSubmit, formState } = useFormWithValidationTracking({
    resolver: zodResolver(WeitereTaetigkeitAbfrageSchema),
    defaultValues: encodeSafely(
      WeitereTaetigkeitAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: WeitereTaetigkeitAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
      dependentValues: {
        wirdZweitePersonBeruecksichtigt,
      },
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const taetigkeitenFlow = bestimmeTaetigkeitenFlow(taetigkeiten);
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const neinLabel =
    routeParams.selbststaendigIndex > 0
      ? `Nein, ${vorname} hatte nur ${formatiereKardinalzahlAlsWort(routeParams.selbststaendigIndex + 1)} selbstständige Tätigkeiten`
      : `Nein, ${vorname} hatte nur eine einzige selbstständige Tätigkeit`;

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <ElternteilTaetigkeitenUebersichtsBox
          currentRoute={currentRoute}
          taetigkeitIndex={routeParams.selbststaendigIndex}
          taetigkeitenFlow="Selbstaendig"
          bemessungszeitraum={bemessungszeitraum}
        />

        <CustomRadioGroup
          legend={`Hatte ${vorname} noch eine weitere selbstständige Tätigkeit im Bemessungszeitraum?`}
          errors={formErrors}
          register={register}
          name="istWeitereTaetigkeitVorhanden"
          options={[
            {
              value: "yes",
              label: `Ja, ${vorname} hatte noch eine ${formatiereOrdnungszahlAlsWort(routeParams.selbststaendigIndex + 2)} selbstständige Tätigkeit`,
            },
            {
              value: "no",
              label: neinLabel,
            },
          ]}
        />

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
