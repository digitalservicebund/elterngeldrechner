import { MinimaleAuswahlErfuellt } from "./MinimaleAuswahlErfuellt";
import { VorlaeufigGueltigerPlan } from "./VorlaeufigGueltigerPlan";
import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";

export function FinalGueltigerPlan<A extends Ausgangslage>() {
  return VorlaeufigGueltigerPlan<A>().and(MinimaleAuswahlErfuellt<A>());
}
