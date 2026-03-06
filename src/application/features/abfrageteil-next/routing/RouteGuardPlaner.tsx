import { Navigate, Outlet } from "react-router";
import { useAusgangslage } from "@/application/pages/planungsteil/useAusgangslage";

export function RouteGuardPlaner() {
  const ausgangslage = useAusgangslage();

  if (
    !ausgangslage ||
    !ausgangslage.anzahlElternteile ||
    !ausgangslage.geburtsdatumDesKindes
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
