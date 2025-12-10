import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { InfoZuWeitereTaetigkeiten } from "./InfoBoxen/InfoZuWeitereTaetigkeiten";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import { PersonPageFlow } from "@/application/features/abfrage-prototyp/components/PersonPageRouting";
import { berechneExaktenBemessungszeitraum } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";
import {
  type StepPrototypState,
  stepPrototypSelectors,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { YesNo } from "@/application/features/abfrageteil/state";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly flow: PersonPageFlow;
  readonly incomeIndex: number;
};

export function WeitereTaetigkeitForm({
  id,
  onSubmit,
  elternteil,
  flow,
  incomeIndex,
}: Props) {
  const store = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: store.getState().stepPrototyp,
  });

  const istNichtSelbststaendigenFlow =
    flow !== PersonPageFlow.selbststaendig &&
    flow !== PersonPageFlow.mischeinkuenfte;

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      const isWeitereTaetigkeitActive =
        elternteil === Elternteil.Eins
          ? values.ET1.uebersichtTaetigkeiten[incomeIndex]!.isActive
          : values.ET2.uebersichtTaetigkeiten[incomeIndex]!.isActive;

      if (
        istNichtSelbststaendigenFlow &&
        isWeitereTaetigkeitActive === YesNo.YES
      ) {
        if (elternteil === Elternteil.Eins) {
          if (
            values.ET1.uebersichtTaetigkeiten[incomeIndex]!
              .taetigkeitenSelektor === null
          ) {
            values.ET1.uebersichtTaetigkeiten[
              incomeIndex
            ]!.taetigkeitenSelektor = "nichtSelbststaendig";
          }

          if (values.ET1.taetigkeiten.length < incomeIndex + 1) {
            values.ET1.taetigkeiten[incomeIndex] = {
              taetigkeitenArt: "nichtSelbststaendig",

              zahlenSieKirchenSteuer: null,

              selbststaendigKVPflichtversichert: null,
              selbststaendigRVPflichtversichert: null,
              selbststaendigAVPflichtversichert: null,
              bruttoJahresgewinn: null,

              isDurchschnittseinkommen: null,
              bruttoMonatsschnitt: null,
              bruttoMonatsangaben: null,
              isMinijob: null,
              steuerklasse: null,
            };
          }
        } else {
          if (
            values.ET2.uebersichtTaetigkeiten[incomeIndex]!
              .taetigkeitenSelektor === null
          ) {
            values.ET2.uebersichtTaetigkeiten[
              incomeIndex
            ]!.taetigkeitenSelektor = "nichtSelbststaendig";
          }

          if (values.ET2.taetigkeiten.length < incomeIndex + 1) {
            values.ET2.taetigkeiten[incomeIndex] = {
              taetigkeitenArt: "nichtSelbststaendig",

              zahlenSieKirchenSteuer: null,

              selbststaendigKVPflichtversichert: null,
              selbststaendigRVPflichtversichert: null,
              selbststaendigAVPflichtversichert: null,
              bruttoJahresgewinn: null,

              isDurchschnittseinkommen: null,
              bruttoMonatsschnitt: null,
              bruttoMonatsangaben: null,
              isMinijob: null,
              steuerklasse: null,
            };
          }
        }
      }

      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [istNichtSelbststaendigenFlow, store, onSubmit, elternteil, incomeIndex],
  );

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
  const maximalerBemessungszeitraum = berechneExaktenBemessungszeitraum(
    geburtsdatumDesKindes,
    flow,
    ausklammerungen,
  );

  const hasWeitereTaetigkeitOptions: CustomRadioGroupOption<YesNo>[] = [
    { value: YesNo.YES, label: "Ja, ich hatte eine weitere Tätigkeit" },
    { value: YesNo.NO, label: "Nein, ich hatte keine weitere Tätigkeit" },
  ];

  const formattedDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <section className="mb-40" aria-live="polite" aria-labelledby="bmz">
          <div className="mt-40 rounded bg-grey-light py-10">
            <span className="text-18 px-20 font-bold">
              Bemessungszeitraum: {maximalerBemessungszeitraum}
            </span>
          </div>
          {ausklammerungen.length > 0 ? (
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

        <h3 className="mb-10">
          Hatten Sie noch weitere Tätigkeiten im Bemessungszeitraum?
        </h3>

        <InfoZuWeitereTaetigkeiten />

        <CustomRadioGroup
          className="mb-32 mt-20"
          legend=""
          options={hasWeitereTaetigkeitOptions}
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.uebersichtTaetigkeiten.${incomeIndex}.isActive`}
          errors={errors}
        />
      </div>
    </form>
  );
}
