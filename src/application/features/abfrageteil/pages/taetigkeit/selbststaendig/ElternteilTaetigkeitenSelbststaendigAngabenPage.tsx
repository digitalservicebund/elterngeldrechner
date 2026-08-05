import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  TaetigkeitSelbststaendigAngaben,
  TaetigkeitSelbststaendigAngabenSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import { Button, InfoText } from "@/application/features/components";
import { CurrencyInput } from "@/application/features/abfrageteil/components/CurrencyInput";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { findeVornamen } from "@/application/features/abfrageteil/domain/findeVornamen";
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
import { ElternteilTaetigkeitenUebersichtsBox } from "../ElternteilTaetigkeitenUebersichtsBox";

export function ElternteilTaetigkeitenSelbststaendigAngabenPage() {
  const { dispatch, findeLetztesGueltigesEvent, filtereValideEventHistorie } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilTaetigkeitenSelbststaendigAngaben;
  const routeParams = useRouteParams(currentRoute);
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    currentRoute,
    routeParams,
  );

  const { register, handleSubmit, formState, control } =
    useFormWithValidationTracking({
      resolver: zodResolver(TaetigkeitSelbststaendigAngabenSchema),
      defaultValues: encodeSafely(
        TaetigkeitSelbststaendigAngabenSchema,
        letztesGueltigesEvent,
      ),
    });

  const { errors: formErrors } = formState;

  const onSubmit = async (values: TaetigkeitSelbststaendigAngaben) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: routeParams,
    };

    dispatch(event);

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute, routeParams);

  const { berechneBemessungszeitraum } = useBemessungszeitraumrechner(
    routeParams.elternteilIndex,
  );
  const bemessungszeitraum = berechneBemessungszeitraum("Selbstaendig");

  const eventStream = filtereValideEventHistorie();
  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form id={formIdentifier} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="content-container">
          <ElternteilTaetigkeitenUebersichtsBox
            currentRoute={currentRoute}
            taetigkeitIndex={routeParams.selbststaendigIndex}
            taetigkeitenFlow="Selbstaendig"
            bemessungszeitraum={bemessungszeitraum}
          />

          <CustomRadioGroup
            legend={`War ${vorname} kirchensteuerpflichtig?`}
            errors={formErrors}
            register={register}
            name="istKirchensteuerpflichtig"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          />

          <CustomRadioGroup
            legend={`War ${vorname} über die gesetzliche Krankenversicherung
                pflichtversichert?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichKrankenpflichtversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer={
                <>
                  <p>
                    Mit einer selbstständigen Tätigkeit sind Sie in der Regel
                    nicht automatisch gesetzlich pflichtversichert.
                  </p>

                  <p>Sie wählen „Nein“, wenn Sie</p>
                  <ul>
                    <li>freiwillig gesetzlich versichert, </li>
                    <li>familienversichert,</li>
                    <li>privat versichert,</li>
                    <li>nicht (in Deutschland) krankenversichert sind.</li>
                  </ul>

                  <p>
                    Hinweis: In diesem Fall müssen Sie entsprechende Beiträge
                    für Ihre Krankenversicherung selber einplanen, da sie nicht
                    automatisch berücksichtigt werden.
                  </p>
                </>
              }
            />
          </CustomRadioGroup>

          <CustomRadioGroup
            legend={`Zahlte ${vorname} Pflichtbeiträge in die gesetzliche
                Rentenversicherung?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichRentenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer="Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in der gesetzlichen Rentenversicherung pflichtversichert.Sie leisten nur dann Pflichtbeiträge, wenn Sie zu einer der wenigen Berufsgruppen gehören, die rentenversicherungspflichtig sind – zum Beispiel Lehrer:innen, Pflegepersonen, Künstler:innen oder Journalist:innen."
            />
          </CustomRadioGroup>

          <CustomRadioGroup
            legend={`Zahlte ${vorname} Pflichtbeiträge in die gesetzliche
                Arbeitslosenversicherung?`}
            errors={formErrors}
            register={register}
            name="istGesetzlichArbeitlosenversichert"
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
          >
            <InfoText
              question="Was bedeutet das?"
              answer="Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in der gesetzlichen Arbeitslosenversicherung pflichtversichert. Sie zahlen keine Pflichtbeiträge und sind nur dann versichert, wenn Sie eine freiwillige Versicherung abgeschlossen haben – das ist jedoch eher die Ausnahme."
            />
          </CustomRadioGroup>

          <div className="input-container">
            <div className="text-container">
              <h3>
                Wie hoch war der Gewinn aus der selbstständigen Tätigkeit von{" "}
                {vorname} im Jahr {bemessungszeitraum[0]?.von.year}?
              </h3>

              <p>Geben Sie 0 ein, wenn Sie im Jahr Verlust gemacht haben</p>
            </div>

            <InfoText
              question="Wo finde ich Informationen zum Gewinn?"
              answer={
                <>
                  <p>
                    Für Selbstständige ist der Brutto-Gewinn der Betrag, der
                    übrig bleibt, wenn Sie von Ihren gesamten Einnahmen alle
                    Kosten und Ausgaben (Betriebsausgaben) abgezogen haben.
                  </p>
                  <ul>
                    <li>Es ist nicht Ihr gesamter Umsatz (alle Einnahmen).</li>
                    <li>
                      Es ist Ihr tatsächlicher Gewinn, bevor Sie Ihre
                      persönliche Einkommensteuer dafür bezahlen. Im Steuerrecht
                      spricht man vom steuerpflichtigen Gewinn.
                    </li>
                    <li>
                      Einkünfte aus Vermietung und Verpachtung oder aus
                      Kapitalvermögen werden zwar im Steuerbescheid
                      berücksichtigt, sind aber für die Berechnung des
                      Elterngeldes nicht relevant und müssen von Ihnen
                      rausgerechnet werden
                    </li>
                  </ul>
                  <p>
                    Sie finden diese Angabe in Ihren Unterlagen zur
                    Steuererklärung:
                  </p>
                  <ul>
                    <li>
                      Im Einkommensteuerbescheid: Der Betrag ist dort als
                      &quot;Gewinn aus selbstständiger Arbeit&quot; oder
                      &quot;Summe der positiven Einkünfte&quot; aufgeführt.
                    </li>
                    <li>
                      In der Einnahmen-Überschuss-Rechnung (EÜR): Es ist die
                      Endsumme Ihrer EÜR.
                    </li>
                  </ul>
                  <p>
                    Bitte tragen Sie hier den endgültigen Wert ein, der auch
                    Ihrem Finanzamt gemeldet wurde.
                  </p>
                  <p>
                    Wenn der aktuelle Einkommensteuerbescheid noch nicht
                    vorliegt, geben Sie einen geschätzten Brutto-Gewinn an.
                    Beachten Sie, dass das Ergebnis der Elterngeldberechnung
                    dadurch abweichen kann.
                  </p>
                </>
              }
            />

            <CurrencyInput
              control={control}
              name="bruttoJahresgewinn"
              label="Brutto-Gewinn im gesamten Kalenderjahr"
            />
          </div>
        </div>

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
