import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungGruendeSchema,
} from "./ElternteilSchema";
import { Button, InfoText } from "@/application/components";
import { Alert } from "@/application/components/Alert";
import { CustomCheckbox } from "@/application/features/abfrageteil/components/common";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAnzahlKinder } from "@/application/features/abfrageteil-next/domain/findeAnzahlKinder";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil-next/domain/findeGeschwisterkinder";
import { findeInformationenZumMutterschutz } from "@/application/features/abfrageteil-next/domain/findeInformationenZumMutterschutz";
import { findeVornamen } from "@/application/features/abfrageteil-next/domain/findeVornamen";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useRouteParams } from "@/application/features/abfrageteil-next/hooks/useRouteParams";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";
import { Elternteil } from "@/monatsplaner";

export function ElternteilAusklammerungGruendePage() {
  const {
    dispatch,
    findeLetztesGueltigesEvent,
    findeVorherigenPfad,
    filtereValideEventHistorie,
  } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungGruendeAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );
  const letztesGueltigesEventData = encodeSafely(
    ElternteilAusklammerungGruendeSchema,
    letztesGueltigesEvent,
  ) ?? {
    hatMutterschutzAelteresKind: false,
    hatElterngeldAelteresKind: false,
    hatSchwangerschaftsbedingteErkrankung: false,
    hatKeineAusklammerungsgruende: false,
  };

  const eventStream = filtereValideEventHistorie();
  const esGibtGeschwisterkinder =
    findeGeschwisterkinder(eventStream).length > 0;

  const mutterschutzInformation = findeInformationenZumMutterschutz(
    eventStream,
    findeAnzahlKinder(eventStream),
  );

  const istErsterElternteil = routeParams.elternteilIndex === 0;
  const warErsterElternteilInMutterschutz =
    mutterschutzInformation?.empfaenger === Elternteil.Eins;

  const istSchwangerschaftserkrankungMoeglich =
    istErsterElternteil || !warErsterElternteilInMutterschutz;

  const defaultValues =
    !letztesGueltigesEventData ||
    letztesGueltigesEventData.hatKeineAusklammerungsgruende !== false
      ? letztesGueltigesEventData
      : ({
          ...letztesGueltigesEventData,
          hatMutterschutzAelteresKind:
            esGibtGeschwisterkinder &&
            letztesGueltigesEventData.hatMutterschutzAelteresKind,
          hatElterngeldAelteresKind:
            esGibtGeschwisterkinder &&
            letztesGueltigesEventData.hatElterngeldAelteresKind,
          hatSchwangerschaftsbedingteErkrankung:
            istSchwangerschaftserkrankungMoeglich &&
            letztesGueltigesEventData.hatSchwangerschaftsbedingteErkrankung,
        } satisfies ElternteilAusklammerungGruende);

  const form = useForm<ElternteilAusklammerungGruende>({
    resolver: zodResolver(ElternteilAusklammerungGruendeSchema),
    defaultValues,
  });

  const { register, handleSubmit, formState, setValue } = form;
  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAusklammerungGruende) => {
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

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setValue("hatKeineAusklammerungsgruende", false);
    }
  };

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  const showGeneralErrorMessage =
    !!formErrors.hatKeineAusklammerungsgruende?.message;
  const generalErrorId = "keine-auswahl-fehler";

  return (
    <Page heading={`Angaben ${vorname}`}>
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <h3>Treffen folgende Gründe auf {vorname} zu?</h3>

          <InfoText
            question="Warum fragen wir das?"
            answer="Wenn Sie hier etwas auswählen, können Monate, in denen Sie weniger verdient haben, übersprungen werden. Für die Berechnung des Elterngeldes werden dann Monate verwendet, in denen Sie mehr verdient haben."
          />

          {esGibtGeschwisterkinder ? (
            <CustomCheckbox
              className="mt-20"
              register={register}
              name="hatMutterschutzAelteresKind"
              label={`${vorname} war für ein älteres Kind im Mutterschutz`}
              errors={showGeneralErrorMessage}
              aria-describedby={
                showGeneralErrorMessage ? generalErrorId : undefined
              }
              onChange={(checked) => handleCheckboxChange(checked)}
            >
              <InfoText
                question="Was bedeutet Mutterschutz für ein älteres Kind?"
                answer="Bei der Berechnung des Elterngelds können die Monate, in denen Sie Mutterschaftsleistungen für ein älteres Kind erhalten haben, übersprungen werden. Diesen Zeitraum können Sie aus der Bescheinigung Ihres Arbeitgebers oder Ihrer Krankenkasse ablesen."
              />
            </CustomCheckbox>
          ) : (
            <input type="hidden" {...register("hatMutterschutzAelteresKind")} />
          )}

          {esGibtGeschwisterkinder ? (
            <CustomCheckbox
              className="mt-20"
              register={register}
              name="hatElterngeldAelteresKind"
              label={`${vorname} hat für ein älteres Kind Elterngeld bekommen`}
              errors={showGeneralErrorMessage}
              aria-describedby={
                showGeneralErrorMessage ? generalErrorId : undefined
              }
              onChange={(checked) => handleCheckboxChange(checked)}
            >
              <InfoText
                question="Was bedeutet Elterngeld für ein älteres Kind?"
                answer="Bei der Berechnung des Elterngelds können auch die Monate, in denen Sie Elterngeld für ein älteres Kind erhalten haben, übersprungen werden. Das gilt nur für die ersten 14 Lebensmonate dieses Kindes."
              />
            </CustomCheckbox>
          ) : (
            <input type="hidden" {...register("hatElterngeldAelteresKind")} />
          )}

          {istSchwangerschaftserkrankungMoeglich ? (
            <CustomCheckbox
              className="mt-20"
              register={register}
              name="hatSchwangerschaftsbedingteErkrankung"
              label={`${vorname} hatte eine Erkrankung wegen der Schwangerschaft und hatte weniger Einkommen`}
              errors={showGeneralErrorMessage}
              aria-describedby={
                showGeneralErrorMessage ? generalErrorId : undefined
              }
              onChange={(checked) => handleCheckboxChange(checked)}
            >
              <InfoText
                question="Was bedeutet Krankheit wegen der Schwangerschaft?"
                answer="Wenn Sie aufgrund Ihrer Schwangerschaft krank waren, können diese Monate übersprungen werden."
              />
            </CustomCheckbox>
          ) : (
            <input
              type="hidden"
              {...register("hatSchwangerschaftsbedingteErkrankung")}
            />
          )}

          <CustomCheckbox
            className="mt-20"
            register={register}
            name="hatKeineAusklammerungsgruende"
            label="Keiner der genannten Gründe"
            errors={showGeneralErrorMessage}
            aria-describedby={
              showGeneralErrorMessage ? generalErrorId : undefined
            }
            onChange={(checked) => {
              if (checked) {
                setValue("hatMutterschutzAelteresKind", false);
                setValue("hatElterngeldAelteresKind", false);
                setValue("hatSchwangerschaftsbedingteErkrankung", false);
              }
            }}
          />

          {!!showGeneralErrorMessage && (
            <p
              id={generalErrorId}
              className="text-red-500 font-medium mt-4 text-danger"
              role="alert"
              aria-live="assertive"
              aria-atomic
            >
              {formErrors.hatKeineAusklammerungsgruende?.message}
            </p>
          )}
        </div>

        {/* TODO-Abfrage: Icon bei Alert ändern */}
        <Alert headline="Gut zu wissen für die spätere Antragstellung:">
          Wenn Sie vor der Geburt selbstständig waren und Gründe vorliegen, den
          Bemessungszeitraum zu verschieben (wie auf dieser Seite angegeben),
          können Sie später im Elterngeldantrag beantragen, den
          Bemessungszeitraum um ein Jahr vorzuverlegen.
        </Alert>

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
