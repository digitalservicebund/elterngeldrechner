import { posthog } from "@/application/user-tracking";

export function createTrackedNavigationFunction(
  route: string,
  navigate: () => Promise<void> | void,
): () => Promise<void> {
  return async () => {
    posthog.capture("zurueck_button_geklickt", { route });
    await navigate();
  };
}
