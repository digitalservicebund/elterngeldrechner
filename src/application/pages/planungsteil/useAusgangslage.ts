import { useRef } from "react";
import { isAbfrageteilNextEnabled } from "@/application/feature-flags";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import { erstelleAusgangslage } from "@/application/features/abfrageteil-next/domain/erstelleAusgangslage";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useAppStore } from "@/application/redux/hooks";
import type { Ausgangslage } from "@/monatsplaner";

export function useAusgangslage(): Ausgangslage {
  const store = useAppStore();
  const eventContext = useEventContext();

  const ausgangslage = useRef(
    isAbfrageteilNextEnabled()
      ? erstelleAusgangslage(eventContext.filtereValideEventHistorie())
      : composeAusgangslageFuerPlaner(store.getState()),
  );

  return ausgangslage.current;
}
