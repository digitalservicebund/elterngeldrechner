import { useRef } from "react";
import { erstelleAusgangslage } from "@/application/features/abfrageteil/domain/erstelleAusgangslage";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import type { Ausgangslage } from "@/monatsplaner";

export function useAusgangslage(): Ausgangslage {
  const eventContext = useEventContext();

  const ausgangslage = useRef(
    erstelleAusgangslage(eventContext.filtereValideEventHistorie()),
  );

  return ausgangslage.current;
}
