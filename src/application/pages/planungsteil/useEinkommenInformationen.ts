import { isAbfrageteilNextEnabled } from "@/application/feature-flags";
import { YesNo } from "@/application/features/abfrageteil/state";
import { useOptionalEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing";
import { useAppSelector } from "@/application/redux/hooks";

export type EinkommenInformationen = {
  readonly gesamteinkommenGrenzeUeberschritten: boolean;
};

export function useEinkommenInformationen(): EinkommenInformationen {
  const eventContext = useOptionalEventContext();
  const gesamteinkommenGrenzeUeberschrittenFromRedux = useAppSelector(
    (state) => state.stepEinkommen.limitEinkommenUeberschritten === YesNo.YES,
  );

  if (isAbfrageteilNextEnabled() && eventContext) {
    const allgemeineAngaben = eventContext.findeLetztesGueltigesEvent(
      Route.AllgemeineAngaben,
    );
    return {
      gesamteinkommenGrenzeUeberschritten:
        allgemeineAngaben?.gesamteinkommenGrenzeUeberschritten ?? false,
    };
  }

  return {
    gesamteinkommenGrenzeUeberschritten:
      gesamteinkommenGrenzeUeberschrittenFromRedux,
  };
}
