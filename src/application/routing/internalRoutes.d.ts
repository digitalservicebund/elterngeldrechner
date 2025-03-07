import { ReactNode } from "react";
import { formSteps } from "./formSteps";
import { RootState } from "@/application/redux";

type InternalStepRoute = {
  element: ReactNode;
  path: (typeof formSteps)[keyof typeof formSteps]["route"];
};

type InternalGuardedRoute = InternalStepRoute & {
  precondition: (state: RootState) => boolean;
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
