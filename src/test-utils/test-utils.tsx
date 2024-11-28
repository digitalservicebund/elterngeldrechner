// Reusable render function that sets up a Provider-Wrapper
// See https://redux.js.org/usage/writing-tests#components
// and https://stackoverflow.com/questions/61451631/react-testing-library-setup-for-redux-router-and-dynamic-modules-using-typescri

import { ReactElement, ReactNode } from "react";
import {
  render,
  renderHook,
  RenderHookResult,
  RenderOptions,
} from "@testing-library/react";
import { configureStore, Store } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Big from "big.js";
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import { AppStore, reducers, RootState } from "@/redux";
import { AriaLogProvider } from "@/components/atoms";
import { initialStepNachwuchsState } from "@/redux/stepNachwuchsSlice";
import { initialStepErwerbstaetigkeitState } from "@/redux/stepErwerbstaetigkeitSlice";
import { initialStepEinkommenState } from "@/redux/stepEinkommenSlice";
import { initialStepConfigurationState } from "@/redux/configurationSlice";
import { initialStepAllgemeineAngabenState } from "@/redux/stepAllgemeineAngabenSlice";
import { initialFeedbackState } from "@/redux/feedbackSlice";

interface RenderOptionsWithRedux extends RenderOptions {
  preloadedState?: Partial<RootState>;
  store?: Store;
}

interface TestWrapperProps {
  readonly store: Store;
  readonly children: ReactNode;
}

function TestWrapper({ store, children }: TestWrapperProps) {
  const routes: RouteObject[] = [
    { path: "/", element: <div>{children}</div> },
    { path: "*", element: "404" },
  ];
  const router = createMemoryRouter(routes, { initialEntries: ["/"] });

  return (
    <AriaLogProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AriaLogProvider>
  );
}

const renderWithRedux = (
  ui: ReactElement,
  {
    preloadedState,
    store = configureStore({ reducer: reducers, preloadedState }),
    ...renderOptions
  }: RenderOptionsWithRedux = {},
) => {
  function Wrapper({ children }: { readonly children?: ReactNode }) {
    return <TestWrapper store={store}>{children}</TestWrapper>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

function renderHookWithRedux<Result, Props>(
  render: (props: Props) => Result,
  {
    preloadedState,
    store = configureStore({ reducer: reducers, preloadedState }),
    ...renderOptions
  }: RenderOptionsWithRedux = {},
): RenderHookResult<Result, Props> & { store: AppStore } {
  function Wrapper({ children }: { readonly children?: ReactNode }) {
    return <TestWrapper store={store}>{children}</TestWrapper>;
  }

  return {
    ...renderHook(render, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderWithRedux as render, renderHookWithRedux as renderHook };

export const toListWithTolerance = (n: number) => {
  const num = Big(n);
  return [
    n,
    num.plus(0.01).toNumber(),
    num.plus(0.02).toNumber(),
    num.minus(0.01).toNumber(),
    num.minus(0.02).toNumber(),
  ];
};

export const INITIAL_STATE: RootState = {
  stepAllgemeineAngaben: initialStepAllgemeineAngabenState,
  stepNachwuchs: initialStepNachwuchsState,
  stepErwerbstaetigkeit: initialStepErwerbstaetigkeitState,
  stepEinkommen: initialStepEinkommenState,
  configuration: initialStepConfigurationState,
  feedback: initialFeedbackState,
};
