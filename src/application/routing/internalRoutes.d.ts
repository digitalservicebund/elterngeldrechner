import { ReactNode } from "react";
import { formSteps } from "./formSteps";
import { RootState } from "@/application/redux";
import { useAppStore } from "../redux/hooks";

type InternalStepRoute = {
  element: ReactNode;
  path: (typeof formSteps)[keyof typeof formSteps]["route"];
};

type InternalGuardedRoute = InternalStepRoute & {
  precondition: (
    state: RootState,
    store: ReturnType<typeof useAppStore>,
  ) => boolean;
};

type InternalRedirectRoute = {
  element: ReactNode;
  path: "*";
};

type InternalRoute =
  | InternalStepRoute
  | InternalGuardedRoute
  | InternalRedirectRoute;

type InternalRouteDefinition = [
  InternalStepRoute,
  ...InternalGuardedRoute[],
  InternalRedirectRoute,
];
