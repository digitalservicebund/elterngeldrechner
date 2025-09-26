import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  type StepPrototypState,
  stepPrototypSlice,
  stepPrototypSelectors,
} from "@/application/features/abfrage-prototyp/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";
import { PersonPageFlow } from "./PersonPageRouting";
import { CustomDate } from "../../abfrageteil/components/NachwuchsForm/CustomDate";
import { berechneMaximalenBemessungszeitraum } from "./berechneBemessungszeitraum";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow?: PersonPageFlow;
  readonly pageType: "zeitraumKeinEinkommen" | "zeitraumErsatzleistungen";
};

export function KeinEinkommenForm({
  id,
  onSubmit,
  pageType,
  elternteil,
}: Props) {
  const store = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );
  const maximalerBemessungszeitraum = berechneMaximalenBemessungszeitraum(
    geburtsdatumDesKindes,
  );

  return (
    <form
      id={id}
      // className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      {pageType === "zeitraumKeinEinkommen" && (
        <>
          <div className="mt-40">
            <h3 className="mb-16">
              Geben Sie an von wann bis wann Sie kein Einkommen hatten:
              <ul className="list list-disc ml-40">
                <li>{maximalerBemessungszeitraum[0]}</li>
                <li>{maximalerBemessungszeitraum[1]}</li>
              </ul>
            </h3>
            <p className="pt-20">
              Wenn Sie kein Einkommen hatten, erhalten Sie den Mindestbetrag
              Elterngeld.
            </p>
          </div>

          <section className="mt-10">
            <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
              <div>
                <label className="mt-20 block text-16">Start</label>
                <CustomDate
                  // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.keinEinkommenVon?.message
                      : errors.ET2?.keinEinkommenVon?.message
                  }
                  {...register(
                    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.keinEinkommenVon`,
                    {
                      required: "Dieses Feld ist erforderlich",
                      pattern: {
                        value: /^\d{2}\.\d{2}\.\d{4}$/,
                        message: "Bitte das Feld vollständig ausfüllen",
                      },
                    },
                  )}
                />
              </div>
              <div>
                <label className="mt-20 block text-16">Ende</label>
                <CustomDate
                  // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.keinEinkommenBis?.message
                      : errors.ET2?.keinEinkommenBis?.message
                  }
                  {...register(
                    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.keinEinkommenBis`,
                    {
                      required: "Dieses Feld ist erforderlich",
                      pattern: {
                        value: /^\d{2}\.\d{2}\.\d{4}$/,
                        message: "Bitte das Feld vollständig ausfüllen",
                      },
                    },
                  )}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {pageType === "zeitraumErsatzleistungen" && (
        <>
          <div className="mt-40">
            <h3 className="mb-16">
              Geben Sie an von wann bis wann Sie Sozialleistungen oder
              Lohnersatzleistungen erhalten haben:
              <ul className="list list-disc ml-40">
                <li>{maximalerBemessungszeitraum[0]}</li>
                <li>{maximalerBemessungszeitraum[1]}</li>
              </ul>
            </h3>
          </div>

          <section className="mt-10">
            <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
              <div>
                <label className="mt-20 block text-16">Start</label>
                <CustomDate
                  // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.sozialleistungenVon?.message
                      : errors.ET2?.sozialleistungenVon?.message
                  }
                  {...register(
                    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.sozialleistungenVon`,
                    {
                      required: "Dieses Feld ist erforderlich",
                      pattern: {
                        value: /^\d{2}\.\d{2}\.\d{4}$/,
                        message: "Bitte das Feld vollständig ausfüllen",
                      },
                    },
                  )}
                />
              </div>
              <div>
                <label className="mt-20 block text-16">Ende</label>
                <CustomDate
                  // id="{wahrscheinlichesGeburtsDatumInputIdentifier}"
                  error={
                    elternteil === Elternteil.Eins
                      ? errors.ET1?.sozialleistungenBis?.message
                      : errors.ET2?.sozialleistungenBis?.message
                  }
                  {...register(
                    `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.sozialleistungenBis`,
                    {
                      required: "Dieses Feld ist erforderlich",
                      pattern: {
                        value: /^\d{2}\.\d{2}\.\d{4}$/,
                        message: "Bitte das Feld vollständig ausfüllen",
                      },
                    },
                  )}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </form>
  );
}
