import { isAbfrageteilNextEnabled } from "@/application/feature-flags";
import { stepAllgemeineAngabenSelectors } from "@/application/features/abfrageteil/state";
import { useOptionalEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing";
import {
  type Bundesland,
  getBundeslandAntragSupportByName,
} from "@/application/features/pdfAntrag";
import { useAppSelector } from "@/application/redux/hooks";

export type AntragInformationen = ReturnType<
  typeof getBundeslandAntragSupportByName
>;

export function useAntragInformationen(): AntragInformationen | null {
  const eventContext = useOptionalEventContext();
  const bundeslandFromRedux = useAppSelector(
    stepAllgemeineAngabenSelectors.getBundeslandAntragSupport,
  );

  if (isAbfrageteilNextEnabled() && eventContext) {
    const allgemeineAngaben = eventContext.findeLetztesGueltigesEvent(
      Route.AllgemeineAngaben,
    );
    return allgemeineAngaben
      ? getBundeslandAntragSupportByName(
          allgemeineAngaben.bundesland as Bundesland,
        )
      : null;
  }

  return bundeslandFromRedux;
}
