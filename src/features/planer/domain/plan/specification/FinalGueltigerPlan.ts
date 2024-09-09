import { VorlaeufigGueltigerPlan } from "./VorlaeufigGueltigerPlan";
import { MinimaleAuswahlErfuellt } from "./MinimaleAuswahlErfuellt";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";

export function FinalGueltigerPlan<A extends Ausgangslage>() {
  return VorlaeufigGueltigerPlan<A>().and(MinimaleAuswahlErfuellt<A>());
}
