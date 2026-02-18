import { useParams } from "react-router";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { RouteParams } from "@/application/features/abfrageteil-next/routing/routing";

function useParsedIndex(paramName: string, defaultValue: number = 0): number {
  const params = useParams();
  const value = params[paramName];

  if (value === undefined) return defaultValue;

  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function useGeschwisterIndex(): number {
  return useParsedIndex("geschwisterIndex");
}

export function useElternteilIndex(): 0 | 1 {
  const index = useParsedIndex("elternteilIndex");
  return index === 1 ? 1 : 0;
}

export function useTaetigkeitIndex(): number {
  return useParsedIndex("taetigkeitIndex");
}

// TOD0: Maybe refactor in this direction
export function useRouteParams<R extends Route>(_: R) {
  return useParams<RouteParams<R>>();
}
