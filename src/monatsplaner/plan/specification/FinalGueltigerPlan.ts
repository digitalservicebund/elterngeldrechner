import { MinimaleAuswahlErfuellt } from "./MinimaleAuswahlErfuellt";
import { VorlaeufigGueltigerPlan } from "./VorlaeufigGueltigerPlan";
import type { Ausgangslage } from "@/monatsplaner/ausgangslage";

export function FinalGueltigerPlan<A extends Ausgangslage>() {
  return VorlaeufigGueltigerPlan<A>().and(MinimaleAuswahlErfuellt<A>());
}
