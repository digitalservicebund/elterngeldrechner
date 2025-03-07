// Reusable render function that sets up a Provider-Wrapper
// See https://redux.js.org/usage/writing-tests#components
// and https://stackoverflow.com/questions/61451631/react-testing-library-setup-for-redux-router-and-dynamic-modules-using-typescri

import { Store, configureStore } from "@reduxjs/toolkit";
import {
  RenderHookResult,
  RenderOptions,
  render,
  renderHook,
} from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import {
  type RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import {
  stepAllgemeineAngabenSlice,
  stepEinkommenSlice,
  stepErwerbstaetigkeitSlice,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { feedbackSlice } from "@/application/features/user-feedback";
import { AppStore, RootState, reducers } from "@/application/redux";
import { configurationSlice } from "@/application/redux/configurationSlice";

interface RenderOptionsWithRedux extends RenderOptions {
  preloadedState?: Partial<RootState>;
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

const renderWithRedux = (
  ui: ReactElement,
  { preloadedState, ...renderOptions }: RenderOptionsWithRedux = {},
) => {
  const store = configureStore({ reducer: reducers, preloadedState });
  function Wrapper({ children }: { readonly children?: ReactNode }) {
    return <TestWrapper store={store}>{children}</TestWrapper>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

function renderHookWithRedux<Result, Props>(
  render: (props: Props) => Result,
  { preloadedState, ...renderOptions }: RenderOptionsWithRedux = {},
): RenderHookResult<Result, Props> & { store: AppStore } {
  const store = configureStore({ reducer: reducers, preloadedState });

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
export { renderHookWithRedux as renderHook, renderWithRedux as render };

export const INITIAL_STATE: RootState = {
  stepAllgemeineAngaben: stepAllgemeineAngabenSlice.getInitialState(),
  stepNachwuchs: stepNachwuchsSlice.getInitialState(),
  stepErwerbstaetigkeit: stepErwerbstaetigkeitSlice.getInitialState(),
  stepEinkommen: stepEinkommenSlice.getInitialState(),
  configuration: configurationSlice.getInitialState(),
  feedback: feedbackSlice.getInitialState(),
};
