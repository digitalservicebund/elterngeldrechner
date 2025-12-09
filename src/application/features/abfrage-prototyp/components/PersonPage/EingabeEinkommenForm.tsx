import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { InfoZuBruttoGewinn } from "@/application/features/abfrage-prototyp/components/InfoZuBruttoGewinn";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import {
  ZeitabschnittArt,
  berechneExaktenBemessungszeitraum,
  erstelleExakteZeitabschnitteBemessungszeitraum,
} from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { CustomNumberField } from "@/application/features/abfrageteil/components/common";
import { YesNo } from "@/application/features/abfrageteil/state";
import { RootState } from "@/application/redux";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly incomeIndex: number;
};

export function EingabeEinkommenForm({
  id,
  onSubmit,
  elternteil,
  incomeIndex,
}: Props) {
  const store = useAppStore();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const submitAngabenEinkommen = useCallback(
    (values: StepPrototypState) => {
      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [store, onSubmit],
  );

  const taetigkeitenET1 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET1,
  );
  const taetigkeitenET2 = useAppSelector(
    stepPrototypSelectors.getTaetigkeitenET2,
  );
  const taetigkeiten =
    elternteil === Elternteil.Eins ? taetigkeitenET1 : taetigkeitenET2;
  const taetigkeit =
    elternteil === Elternteil.Eins
      ? taetigkeitenET1[incomeIndex]
      : taetigkeitenET2[incomeIndex];

  const verbeamtungET1 = useAppSelector(
    stepPrototypSelectors.getVerbeamtungET1,
  );
  const verbeamtungET2 = useAppSelector(
    stepPrototypSelectors.getVerbeamtungET2,
  );
  const verbeamtung =
    elternteil === Elternteil.Eins ? verbeamtungET1 : verbeamtungET2;

  const ausklammerungenET1 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET1,
  );
  const ausklammerungenET2 = useAppSelector(
    stepPrototypSelectors.getAusklammerungenET2,
  );
  const ausklammerungen =
    elternteil === Elternteil.Eins ? ausklammerungenET1 : ausklammerungenET2;

  const geburtsdatumDesKindes = useAppSelector(
    stepPrototypSelectors.getWahrscheinlichesGeburtsDatum,
  );

  const routerState = useSelector((state: RootState) => state.routingPrototyp);
  const currentPersonPageFlow =
    elternteil === Elternteil.Eins
      ? routerState.currentPersonPageFlowET1
      : routerState.currentPersonPageFlowET2;

  const flowForBMZ =
    taetigkeit?.taetigkeitenArt === "selbststaendig"
      ? PersonPageFlow.selbststaendig
      : PersonPageFlow.nichtSelbststaendig;
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    currentPersonPageFlow,
    ausklammerungen,
  );
  const exakteZeitabschnitteBemessungszeitraum =
    erstelleExakteZeitabschnitteBemessungszeitraum(
      geburtsdatumDesKindes,
      flowForBMZ,
      ausklammerungen,
    );

  const formattedDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <form id={id} onSubmit={handleSubmit(submitAngabenEinkommen)} noValidate>
      <div>
        <section className="mb-40" aria-live="polite" aria-labelledby="bmz">
          <div className="mt-40 rounded bg-grey-light py-10">
            <span className="text-18 px-20 font-bold">
              Bemessungszeitraum: {maximalerBemessungszeitraum}
            </span>
          </div>
          {ausklammerungen.length > 0 &&
          taetigkeit?.isDurchschnittseinkommen === YesNo.YES ? (
            <div className="rounded-b border-x border-b border-t-0 border-dashed border-grey p-20">
              <h5 className="text-14">Übersprungene Zeiträume:</h5>
              <ul className="ml-32 mt-4 list-disc text-14">
                {ausklammerungen
                  ? ausklammerungen.map((ausklammerung) => (
                      <li key={ausklammerung.beschreibung} className="m-0">
                        {ausklammerung.beschreibung}{" "}
                        {formattedDate(ausklammerung.von)} bis{" "}
                        {formattedDate(ausklammerung.bis)}
                      </li>
                    ))
                  : null}
              </ul>
            </div>
          ) : null}
        </section>

        <h3 className="mb-40">
          Details zur {!verbeamtung ? "angestellten " : ""}Tätigkeit{" "}
          {taetigkeiten.length > 1 ? incomeIndex + 1 : ""}
        </h3>

        {taetigkeit?.isDurchschnittseinkommen === YesNo.YES && (
          <div>
            <h5 className="mb-8">
              Wie viel haben Sie von {maximalerBemessungszeitraum} im Monat
              brutto verdient?
            </h5>
            <CustomNumberField
              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.bruttoMonatsschnitt`}
              label="Monatliches Brutto-Einkommen"
              suffix="Euro"
              slotBeforeLabel={<InfoZuBruttoGewinn />}
              control={control}
              onChange={() => {
                setValue(
                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.bruttoMonatsangaben`,
                  null,
                );
              }}
            />
          </div>
        )}

        {taetigkeit?.isDurchschnittseinkommen === YesNo.NO && (
          <div>
            <h5 className="mb-20">
              Wie viel haben Sie von {maximalerBemessungszeitraum} im Monat
              brutto verdient?
            </h5>
            <InfoZuBruttoGewinn />
            <div className="mt-32">
              {exakteZeitabschnitteBemessungszeitraum!.map(
                ({ art, zeitabschnitt }, index) =>
                  art === ZeitabschnittArt.ausklammerung ? (
                    <section
                      key={index}
                      className="my-32 rounded border-dashed p-16"
                      aria-live="polite"
                      aria-labelledby="bmz"
                    >
                      <div className="pl-32">
                        <h4 className="italic">Übersprungener Zeitraum:</h4>
                        <p key={zeitabschnitt.beschreibung}>
                          {zeitabschnitt.beschreibung}{" "}
                          {formattedDate(zeitabschnitt.von)} bis{" "}
                          {formattedDate(zeitabschnitt.bis)}
                        </p>
                      </div>
                    </section>
                  ) : (
                    <div key={index} className="bg-off-white p-40 pt-32">
                      <div className="pl-8">
                        <strong>{zeitabschnitt.beschreibung}</strong>
                        {zeitabschnitt.monate.map(
                          ({ monatsIndex, monatsName }) => (
                            <CustomNumberField
                              key={monatsIndex}
                              className="mt-10"
                              control={control}
                              name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.bruttoMonatsangaben.${monatsIndex}`}
                              label={`${monatsName} Brutto-Einkommen`}
                              suffix="Euro"
                              required={false}
                              onChange={() => {
                                setValue(
                                  `${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.taetigkeiten.${incomeIndex}.bruttoMonatsschnitt`,
                                  null,
                                );
                              }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
