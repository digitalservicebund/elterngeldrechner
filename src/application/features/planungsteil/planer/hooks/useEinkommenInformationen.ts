import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { Route } from "@/application/routing";

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
