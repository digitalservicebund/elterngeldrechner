import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitGleichesEinkommenAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { NumberInput } from "@/application/features/abfrageteil-next/components/NumberInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
import { findeTaetigkeiten } from "@/application/features/abfrageteil-next/domain/findeTaetigkeiten";
import { formatiereBemessungszeitraum } from "@/application/features/abfrageteil-next/domain/formatiereBemessungszeitraum";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useBemessungszeitraumrechner } from "@/application/features/abfrageteil-next/hooks/useBemessungszeitraumrechner";
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

  const eventStream = filtereValideEventHistorie();
  const taetigkeiten = findeTaetigkeiten(
    eventStream,
    routeParams.elternteilIndex,
  );
  const taetigkeitenFlow =
    taetigkeiten.hatKeinEinkommen === false &&
    taetigkeiten.istSelbststaendig === true
      ? "Selbstaendig"
      : "Nicht-Selbstaendig";
  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum(taetigkeitenFlow);
  const ausklammerungen = findeAusklammerungen(
    eventStream,
    routeParams.elternteilIndex,
  );
  const formatierterBemessungszeitraum = formatiereBemessungszeitraum(
    bemessungszeitraum,
    true,
  );

  return (
    <Page heading="">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow={taetigkeitenFlow}
        />

        <h3 className="mb-10">
          Details zur Tätigkeit als Angestellte oder Angestellter
        </h3>

        <div>
          <h5 className="mb-10">
            Wie viel hat [Person] von {formatierterBemessungszeitraum} im Monat
            brutto verdient?
          </h5>

          <InfoText
            className="mb-16"
            question="Wo finde ich diese Information?"
            answer={
              <>
                <p className=”mb-16”>
                  Am genauesten finden Sie Ihr monatliches Bruttogehalt auf
                  Ihrer Gehaltsabrechnung (meist als „Brutto” oder
                  „Gesamtbrutto” bezeichnet).
                </p>
                <p>
                  Auf Ihrer Lohnsteuerbescheinigung steht das Jahresbrutto. Wenn
                  Sie das ganze Jahr gleich viel verdient haben, können Sie
                  diesen Betrag durch 12 teilen, um einen durchschnittlichen
                  Monatswert zu berechnen.
                </p>
              </>
            }
          />

          <NumberInput
            {...register("durchschnittlichesMonatsbrutto", {
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
            errors={formErrors.durchschnittlichesMonatsbrutto?.message}
          />
        </div>

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
