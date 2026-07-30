import { FormEvent, Route } from "../routing";
import { erstelleFinanzdatenAllerElternteile as erstelleFinanzdatenAllerElternteileCurrent } from "@/application/features/abfrageteil/domain/erstelleFinanzdaten";
import { erstellePersoenlicheDatenAllerElternteile as erstellePersoenlicheDatenAllerElternteileCurrent } from "@/application/features/abfrageteil/domain/erstellePersoenlicheDaten";
import { erstelleFinanzdatenAllerElternteile as erstelleFinanzdatenAllerElternteileNew } from "@/application/features/abfrageteil/domain/erstelleFinanzdatenNew";
import { erstellePersoenlicheDatenAllerElternteile as erstellePersoenlicheDatenAllerElternteileNew } from "@/application/features/abfrageteil/domain/erstellePersoenlicheDatenNew";
import { isNewIncomeFlowEnabled } from ".";

export function erstelleFinanzdatenAllerElternteile(events: FormEvent[]) {
  if (isNewIncomeFlowEnabled()) {
    return erstelleFinanzdatenAllerElternteileNew(events);
  }

  return erstelleFinanzdatenAllerElternteileCurrent(events);
}

export function erstellePersoenlicheDatenAllerElternteile(events: FormEvent[]) {
  if (isNewIncomeFlowEnabled()) {
    return erstellePersoenlicheDatenAllerElternteileNew(events);
  }

  return erstellePersoenlicheDatenAllerElternteileCurrent(events);
}

export const elternteilTaetigkeitenAbfrageRoute = isNewIncomeFlowEnabled()
  ? Route.ElternteilTaetigkeitenAbfrage
  : Route.ElternteilTaetigkeitenAbfrage;
