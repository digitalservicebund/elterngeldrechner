import { FormEvent } from "@/application/features/abfrageteil-next/routing/routing";

export function isEventStream(
  formEvents: FormEvent[],
): formEvents is EventStream {
  return formEvents.length > 0;
}

export type EventStream = [FormEvent, ...FormEvent[]];
