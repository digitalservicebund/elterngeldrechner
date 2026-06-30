import { useNavigate } from "react-router";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { createTrackedNavigationFunction } from "@/application/user-tracking";
import type { ParamsMap, Route } from "@/application/routing";

export function useNavigateBack<R extends Route>(
  currentRoute: R,
  ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
) {
  const { findeVorherigenPfad } = useEventContext();
  const navigate = useNavigate();

  return createTrackedNavigationFunction(currentRoute, () =>
    navigate(findeVorherigenPfad(currentRoute, ...args)),
  );
}
