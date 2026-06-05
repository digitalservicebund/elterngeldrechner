import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { Route } from "@/application/routing";
import {
  type Bundesland,
  getBundeslandAntragSupportByName,
} from "@/application/features/datenuebernahme/pdfAntrag";

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
