import { useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";
import {
  type StepPrototypState,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { useAppStore } from "@/application/redux/hooks";
import { Elternteil } from "@/monatsplaner";

type Props = {
  readonly id?: string;
  readonly onSubmit?: (values: StepPrototypState) => void;
  readonly hideSubmitButton?: boolean;
  readonly elternteil: Elternteil;
  readonly incomeIndex: number;
};

export function WeitereTaetigkeitArtForm({
  id,
  onSubmit,
  elternteil,
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

  const submitNachwuchs = useCallback(
    (values: StepPrototypState) => {
      if (elternteil === Elternteil.Eins) {
        const taetigkeitenSelektor =
          values.ET1.uebersichtTaetigkeiten[incomeIndex]!.taetigkeitenSelektor;

        if (values.ET1.taetigkeiten.length < incomeIndex + 1) {
          values.ET1.taetigkeiten[incomeIndex] = {
            taetigkeitenArt: taetigkeitenSelektor,

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
        const taetigkeitenSelektor =
          values.ET2.uebersichtTaetigkeiten[incomeIndex]!.taetigkeitenSelektor;

        if (values.ET2.taetigkeiten.length < incomeIndex + 1) {
          values.ET2.taetigkeiten[incomeIndex] = {
            taetigkeitenArt: taetigkeitenSelektor,

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

      store.dispatch(stepPrototypSlice.actions.submitStep(values));
      onSubmit?.(values);
    },
    [elternteil, store, onSubmit, incomeIndex],
  );

  const taetigkeitenOptions: CustomRadioGroupOption[] = [
    {
      value: "nichtSelbststaendig",
      label: "Ich war oder bin angestellt",
      labelNode: (
        <div>
          <strong>Ich war oder bin angestellt</strong>
          <p className="mb-8">
            zum Beispiel in Vollzeit, Teilzeit, als Minijob, in Ausbildung,
            Freiwilligendienst
          </p>
        </div>
      ),
    },
    {
      value: "selbststaendig",
      label: "Ich war oder bin selbstständig",
      labelNode: (
        <div>
          <strong>Ich war oder bin selbstständig</strong>
          <p className="mb-8">
            zum Beispiel Gewerbe (Online-Shop, Handwerk, Handel), Land- oder
            Forstbetrieb, Freiberuflichkeit, Selbstständig (GbR, GmbH,
            Beteiligung)
          </p>
        </div>
      ),
    },
  ];

  return (
    <form
      id={id}
      className="flex flex-col gap-32"
      onSubmit={handleSubmit(submitNachwuchs)}
      noValidate
    >
      <div className="mt-40">
        <h3 className="mb-10">
          Um was handelt oder handelte es sich bei der weiteren Tätigkeit?{" "}
        </h3>

        <CustomRadioGroup
          className="mt-20"
          register={register}
          registerOptions={{ required: "Dieses Feld ist erforderlich" }}
          name={`${elternteil === Elternteil.Eins ? "ET1" : "ET2"}.uebersichtTaetigkeiten.${incomeIndex}.taetigkeitenSelektor`}
          errors={errors}
          options={taetigkeitenOptions}
          required
        />
      </div>
    </form>
  );
}
