import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  TaetigkeitSelbststaendigAngaben,
  TaetigkeitSelbststaendigAngabenSchema,
} from "./TaetigkeitSchema";
import { Button, InfoText } from "@/application/components";
import { BemessungszeitraumBox } from "@/application/features/abfrageteil-next/components/BemessungszeitraumBox";
import { CurrencyInput } from "@/application/features/abfrageteil-next/components/CurrencyInput";
import { CustomRadioGroup } from "@/application/features/abfrageteil-next/components/CustomRadioGroup";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { findeAusklammerungen } from "@/application/features/abfrageteil-next/domain/findeAusklammerungen";
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

  const { register, handleSubmit, formState, control } = useForm({
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

  const vorname = findeVornamen(eventStream, routeParams.elternteilIndex);

  return (
    <Page heading={`Finanzielle Situation ${vorname}`}>
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <BemessungszeitraumBox
          bemessungszeitraum={bemessungszeitraum}
          ausklammerungen={ausklammerungen}
          taetigkeitenFlow="Selbstaendig"
        />

        <div>
          <h3 className="mb-10">Details zur selbstständigen Tätigkeit</h3>

          <p>
            Bitte geben Sie hier Details zur Tätigkeit von {vorname} an. Im
            Anschluss haben Sie die Möglichkeit, noch eine weitere Tätigkeit
            anzugeben.
          </p>
        </div>

        <CustomRadioGroup
          legend=<h5 className="mb-10">
            Ist {vorname} kirchensteuerpflichtig?
          </h5>
          errors={formErrors}
          register={register}
          name="istKirchensteuerpflichtig"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        />

        <CustomRadioGroup
          className="mt-16"
          legend=<h5 className="mb-10">
            Ist {vorname} über die gesetzliche Krankenversicherung
            pflichtversichert?
          </h5>
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
                <p className="mb-16">
                  Mit einer selbstständigen Tätigkeit sind Sie in der Regel
                  nicht automatisch gesetzlich pflichtversichert.
                </p>

                <p>Sie wählen „Nein“, wenn Sie</p>
                <ul className="mb-16 ml-8 list-inside list-disc">
                  <li>freiwillig gesetzlich versichert, </li>
                  <li>familienversichert,</li>
                  <li>privat versichert,</li>
                  <li>nicht (in Deutschland) krankenversichert sind.</li>
                </ul>

                <p>
                  Hinweis: In diesem Fall müssen Sie entsprechende Beiträge für
                  Ihre Krankenversicherung zusätzlich eigenständig einplanen, da
                  sie im Elterngeldrechner nicht automatisch berücksichtigt
                  werden.
                </p>
              </>
            }
          />
        </CustomRadioGroup>

        <CustomRadioGroup
          className="mt-16"
          legend=<h5 className="mb-10">
            Zahlt {vorname} Pflichtbeiträge in die gesetzliche
            Rentenversicherung?
          </h5>
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
            answer="Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in der gesetzlichen Rentenversicherung pflichtversichert. Pflichtbeiträge fallen nur in wenigen Fällen an, zum Beispiel für Künstler:innen oder Journalist:innen über die Künstlersozialkasse. Wenn Sie in ein berufsständisches Versorgungswerk eingezahlt haben, wird dies bei der Elterngeldberechnung berücksichtigt."
          />
        </CustomRadioGroup>

        <CustomRadioGroup
          className="mt-16"
          legend=<h5 className="mb-10">
            Zahlt {vorname} Pflichtbeiträge in die gesetzliche
            Arbeitslosenversicherung?
          </h5>
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
            answer="Mit einer selbstständigen Tätigkeit sind Sie in der Regel nicht in der gesetzlichen Arbeitslosenversicherung pflichtversichert. Sie zahlen keine Pflichtbeiträge und sind nur dann versichert, wenn Sie eine freiwillige Arbeitslosenversicherung abgeschlossen haben."
          />
        </CustomRadioGroup>

        <div>
          <h5 className="mb-10">
            Wie hoch war der Gewinn aus der selbstständigen Tätigkeit von{" "}
            {vorname} im Jahr {bemessungszeitraum[0]?.von.year}?
          </h5>

          <InfoText
            className="mb-16"
            question="Wo finde ich Informationen zum Gewinn?"
            answer={
              <>
                <p>
                  Wenn der aktuelle Einkommensteuerbescheid noch nicht vorliegt,
                  geben Sie einen geschätzten Gewinn an. Beachten Sie, dass die
                  spätere Berechnung ihres Elterngeldes durch die
                  Elterngeldstelle dadurch anders ausfallen kann.
                </p>
                <div className="mt-16">
                  <p>
                    Für Selbstständige zählt der Gewinn aus der selbstständigen
                    Tätigkeit. Der Gewinn ist der Betrag, der nach Abzug aller
                    betrieblichen Ausgaben von Ihren Betriebseinnahmen übrig
                    bleibt. Maßgeblich ist nicht Ihr gesamter Umsatz, sondern
                    dieser Gewinn.
                  </p>
                  <p>
                    Den maßgeblichen Gewinn finden Sie in Ihrem
                    Einkommensteuerbescheid bei den Einkünften aus
                    selbstständiger Arbeit oder aus Gewerbebetrieb oder aus
                    Land- und Forstwirtschaft.
                  </p>
                  <p>
                    Einnahmen aus Vermietung und Verpachtung oder aus
                    Kapitalvermögen (zum Beispiel Zinsen) sind zwar im
                    Steuerbescheid enthalten, zählen beim Elterngeld jedoch
                    nicht als Erwerbseinkommen und bleiben daher
                    unberücksichtigt.
                  </p>
                </div>
              </>
            }
          />

          <p className="mb-16">
            Geben Sie 0 ein, wenn Sie im Jahr Verlust gemacht haben
          </p>

          <CurrencyInput
            control={control}
            name="bruttoJahresgewinn"
            label="Gewinn im gesamten Kalenderjahr"
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
