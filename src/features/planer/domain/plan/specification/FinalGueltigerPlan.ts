import { MinimaleAuswahlErfuellt } from "./MinimaleAuswahlErfuellt";
import { VorlaeufigGueltigerPlan } from "./VorlaeufigGueltigerPlan";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";

export function FinalGueltigerPlan<A extends Ausgangslage>() {
  return VorlaeufigGueltigerPlan<A>().and(MinimaleAuswahlErfuellt<A>());
}
