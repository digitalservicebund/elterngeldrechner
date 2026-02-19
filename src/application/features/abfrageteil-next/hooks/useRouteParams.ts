import { useParams } from "react-router";
import type {
  ExtractParams,
  RouteParams,
} from "@/application/features/abfrageteil-next/routing";
import { Route } from "@/application/features/abfrageteil-next/routing";

export function useRouteParams<R extends Route>(
  _: R,
): Record<ExtractParams<R>, number> {
  const params = useParams<RouteParams<R>>();

  return Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, Number(v)]),
  ) as Record<ExtractParams<R>, number>;
}

export type NumericRouteParams<R extends Route> = {
  [K in keyof RouteParams<R>]: number;
};
