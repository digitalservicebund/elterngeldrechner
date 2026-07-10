import { useParams } from "react-router";
import type { ExtractParams, RouteParams } from "@/application/routing";
import { Route } from "@/application/routing";

export function useRouteParams<R extends Route>(
  _: R,
): Record<ExtractParams<R>, number> {
  const params = useParams<RouteParams<R>>();

  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, Number(v)]),
  ) as Record<ExtractParams<R>, number>;
}
