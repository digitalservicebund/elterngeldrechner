import type {
  Auswahlmoeglichkeiten,
  Auswahloption,
  Elterngeldbezuege,
  Elternteil,
  Lebensmonat,
  LebensmonateMitBeliebigenElternteilen,
  Lebensmonatszahl,
  PlanMitBeliebigenElternteilen,
} from "@/features/planer/user-interface/service";
import { MatomoTrackingMetrics } from "@/features/planer/domain/plan";

export type PlanChangedCallback = (
  plan: (PlanMitBeliebigenElternteilen & MatomoTrackingMetrics) | undefined,
) => void;

export type BerechneElterngeldbezuegeCallback = (
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
) => Elterngeldbezuege<Elternteil>;

export type ErstelleUngeplantenLebensmonat<E extends Elternteil> = (
  lebensmonatszahl: Lebensmonatszahl,
) => Lebensmonat<E>;

export type BestimmeAuswahlmoeglichkeiten<E extends Elternteil> = (
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
) => Auswahlmoeglichkeiten;

export type BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E extends Elternteil> =
  OmitFirstArgument<BestimmeAuswahlmoeglichkeiten<E>>;

export type WaehleOption<E extends Elternteil> = (
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  option: Auswahloption,
) => void;

export type WaehleOptionInLebensmonat<E extends Elternteil> = OmitFirstArgument<
  WaehleOption<E>
>;

export type ErstelleVorschlaegeFuerAngabeDesEinkommens<E extends Elternteil> = (
  Lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
) => number[];

export type ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat<
  E extends Elternteil,
> = OmitFirstArgument<ErstelleVorschlaegeFuerAngabeDesEinkommens<E>>;

export type GebeEinkommenAn<E extends Elternteil> = (
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  bruttoeinkommen: number,
) => void;

export type GebeEinkommenInLebensmonatAn<E extends Elternteil> =
  OmitFirstArgument<GebeEinkommenAn<E>>;

type OmitFirstArgument<Function> = Function extends (
  firstArgument: infer _,
  ...remainingArguments: infer Arguments
) => infer ReturnType
  ? (...argumentList: Arguments) => ReturnType
  : never;
