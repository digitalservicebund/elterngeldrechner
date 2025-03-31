import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "./CustomInput";
import {
  Button,
  CustomRadioGroup,
  CustomRadioGroupOption,
  InfoText,
} from "@/application/components";
import {
  Split,
  YesNoRadio,
} from "@/application/features/abfrageteil/components/common";
import {
  StepAllgemeineAngabenState,
  YesNo,
  stepAllgemeineAngabenSlice,
} from "@/application/features/abfrageteil/state";
import { useAppStore } from "@/application/redux/hooks";

const antragstellendeOptions: CustomRadioGroupOption[] = [
  { value: "EinenElternteil", label: "Für einen Elternteil" },
  { value: "FuerBeide", label: "Für zwei Elternteile" },
];

const alleinerziehendInfoText =
  "Als alleinerziehend gelten Sie, wenn der andere Elternteil weder mit Ihnen noch mit dem Kind zusammen wohnt und Sie steuerrechtlich als alleinerziehend gelten.";

type Props = {
  readonly id?: string;
  readonly onSubmit?: () => void;
  readonly hideSubmitButton?: boolean;
};

export function AllgemeineAngabenForm({
  id,
  onSubmit,
  hideSubmitButton,
}: Props) {
  const store = useAppStore();

  const { register, handleSubmit, watch, formState, setValue } = useForm({
    defaultValues: store.getState().stepAllgemeineAngaben,
  });

  const submitAllgemeineAngaben = useCallback(
    (values: StepAllgemeineAngabenState) => {
      store.dispatch(stepAllgemeineAngabenSlice.actions.submitStep(values));
      onSubmit?.();
    },
    [store, onSubmit],
  );

  const antragstellendeFormValue = watch("antragstellende");
  const alleinerziehendenFormValue = watch("alleinerziehend");
  const mutterschaftssleistungenFormValue = watch("mutterschaftssleistungen");

  const pseudonymeFormValue = watch("pseudonym");

  const showMutterschaftsleistungsWerGroup =
    antragstellendeFormValue === "FuerBeide" &&
    mutterschaftssleistungenFormValue === YesNo.YES;

  const elternHeadingIdentifier = useId();
  const namenHeadingIdentifier = useId();
  const alleinerziehendHeadindIdentifier = useId();
  const mutterschaftsleistungenHeadingIdentifier = useId();

  const initializeAntragstellendeIfAlleinerziehend = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if ((event.target.value as YesNo) === YesNo.YES) {
      setValue("antragstellende", "EinenElternteil");
    }
  };

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitAllgemeineAngaben)}
      noValidate
    >
      <section aria-labelledby={alleinerziehendHeadindIdentifier}>
        <h3 id={alleinerziehendHeadindIdentifier} className="mb-10">
          Alleinerziehendenstatus
        </h3>

        <YesNoRadio
          legend="Sind Sie alleinerziehend?"
          register={register}
          registerOptions={{
            required: "Dieses Feld ist erforderlich",
            onChange: initializeAntragstellendeIfAlleinerziehend,
          }}
          name="alleinerziehend"
          errors={formState.errors}
          required
          slotBetweenLegendAndOptions={
            <InfoText
              question="Was bedeutet alleinerziehend?"
              answer={alleinerziehendInfoText}
            />
          }
        />
      </section>

      {alleinerziehendenFormValue === YesNo.NO && (
        <section aria-labelledby={elternHeadingIdentifier}>
          <h3 id={elternHeadingIdentifier} className="mb-10">
            Eltern
          </h3>

          <CustomRadioGroup
            legend="Möchten Sie das Elterngeld für einen Elternteil oder zwei Elternteile berechnen?"
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="antragstellende"
            errors={formState.errors}
            options={antragstellendeOptions}
            required
          />
        </section>
      )}

      {antragstellendeFormValue === "FuerBeide" && (
        <section aria-labelledby={namenHeadingIdentifier}>
          <h3 id={namenHeadingIdentifier} className="mb-10">
            Ihre Namen (optional)
          </h3>

          <p>
            Um auf die Begriffe Elternteil 1 und Elternteil 2 in den folgenden
            Schritten verzichten zu können, können Sie hier Ihre Namen oder ein
            Pseudonym angeben, welches wir dann verwenden werden.
          </p>

          <Split>
            <CustomInput
              register={register}
              name="pseudonym.ET1"
              label="Name für Elternteil 1"
            />

            <CustomInput
              register={register}
              name="pseudonym.ET2"
              label="Name für Elternteil 2"
            />
          </Split>
        </section>
      )}

      {((alleinerziehendenFormValue === YesNo.NO &&
        antragstellendeFormValue !== null) ||
        alleinerziehendenFormValue === YesNo.YES) && (
        <section aria-labelledby={mutterschaftsleistungenHeadingIdentifier}>
          <h3 id={mutterschaftsleistungenHeadingIdentifier} className="mb-10">
            Mutterschutz
          </h3>

          <CustomRadioGroup
            legend="Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?"
            register={register}
            registerOptions={{ required: "Dieses Feld ist erforderlich" }}
            name="mutterschaftssleistungen"
            errors={formState.errors}
            required
            options={[
              {
                label:
                  alleinerziehendenFormValue === YesNo.YES
                    ? "Ja, ich bin oder werde im Mutterschutz sein"
                    : "Ja, ein Elternteil ist oder wird im Mutterschutz sein",
                value: YesNo.YES,
              },
              {
                label:
                  alleinerziehendenFormValue === YesNo.YES
                    ? "Nein, ich bin nicht oder werde nicht im Mutterschutz sein"
                    : "Nein, kein Elternteil ist oder wird im Mutterschutz sein",
                value: YesNo.NO,
              },
              { label: "Ich weiß es noch nicht", value: YesNo.NO },
            ]}
            slotBetweenLegendAndOptions={
              <InfoText
                question="Was ist Mutterschutz?"
                answer={
                  <>
                    <p>
                      Während des Mutterschutzes erhalten Sie
                      Mutterschaftsleistungen, zum Beispiel:
                    </p>

                    <ul className="list-inside list-disc">
                      <li>
                        das Mutterschaftsgeld der gesetzlichen Krankenkassen
                      </li>
                      <li>den Arbeitgeber-Zuschuss zum Mutterschaftsgeld</li>
                      <li>
                        die Bezüge für Beamtinnen während des Mutterschutzes
                      </li>
                    </ul>

                    <p>
                      Diese werden – wenn ein Anspruch darauf besteht –
                      normalerweise in den ersten acht Wochen nach der Geburt
                      gezahlt.
                    </p>
                  </>
                }
              />
            }
          />

          {!!showMutterschaftsleistungsWerGroup && (
            <CustomRadioGroup
              className="mt-32"
              legend="Welcher Elternteil ist oder wird im Mutterschutz sein?"
              register={register}
              registerOptions={{ required: "Dieses Feld ist erforderlich" }}
              name="mutterschaftssleistungenWer"
              errors={formState.errors}
              required
              options={[
                {
                  label: `${pseudonymeFormValue.ET1 || "Elternteil 1"} ist oder wird im Mutterschutz sein`,
                  value: "ET1",
                },
                {
                  label: `${pseudonymeFormValue.ET2 || "Elternteil 2"} ist oder wird im Mutterschutz sein`,
                  value: "ET2",
                },
              ]}
              slotBetweenLegendAndOptions={
                <InfoText
                  question="Warum fragen wir das?"
                  answer="Wir fragen das, damit wir wissen, wer im Mutterschutz ist oder sein wird."
                />
              }
            />
          )}
        </section>
      )}

      {!hideSubmitButton && <Button type="submit">Weiter</Button>}
    </form>
  );
}
