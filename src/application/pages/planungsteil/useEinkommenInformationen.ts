import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing";

export type EinkommenInformationen = {
  readonly gesamteinkommenGrenzeUeberschritten: boolean;
};

export function useEinkommenInformationen(): EinkommenInformationen {
  const eventContext = useEventContext();

  const allgemeineAngaben = eventContext.findeLetztesGueltigesEvent(
    Route.AllgemeineAngaben,
  );
  return {
    gesamteinkommenGrenzeUeberschritten:
      allgemeineAngaben?.gesamteinkommenGrenzeUeberschritten ?? false,
  };
}
