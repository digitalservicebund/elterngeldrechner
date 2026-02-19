import { generatePath } from "react-router";

import { generateAbfrageteilPath } from "./generateAbfrageteilPath";
import { FormEvent } from "@/application/features/abfrageteil-next/routing";

function paramsToStrings(
  params: Record<string, number>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value.toString()]),
  );
}

export function generatePathFromEvent(event: FormEvent) {
  return generateAbfrageteilPath(
    generatePath(
      event.route.toString(),
      "params" in event ? paramsToStrings(event.params) : undefined,
    ),
  );
}
