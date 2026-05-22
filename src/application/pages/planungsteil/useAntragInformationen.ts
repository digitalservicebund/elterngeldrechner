import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { Route } from "@/application/features/abfrageteil-next/routing";
import {
  type Bundesland,
  getBundeslandAntragSupportByName,
} from "@/application/features/pdfAntrag";

export type AntragInformationen = ReturnType<
  typeof getBundeslandAntragSupportByName
>;

export function useAntragInformationen(): AntragInformationen | null {
  const eventContext = useEventContext();

  const allgemeineAngaben = eventContext.findeLetztesGueltigesEvent(
    Route.AllgemeineAngaben,
  );
  return allgemeineAngaben
    ? getBundeslandAntragSupportByName(
        allgemeineAngaben.bundesland as Bundesland,
      )
    : null;
}
