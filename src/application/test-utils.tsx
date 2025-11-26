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
  routingPrototypSlice,
  stepPrototypSlice,
} from "./features/abfrage-prototyp/state";
import {
  stepAllgemeineAngabenSlice,
  stepEinkommenSlice,
  stepErwerbstaetigkeitSlice,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { feedbackSlice } from "@/application/features/user-feedback";
import { AppStore, RootState, reducers } from "@/application/redux";

interface RenderOptionsWithRedux extends RenderOptions {
  preloadedState?: Partial<RootState>;
}

type Props = {
  readonly store: Store;
  readonly children: ReactNode;
};

function TestWrapper({ store, children }: Props) {
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

type FormComponentType<P> = React.ComponentType<P & { id: string }>;

/**
 * Renders an arbitrary form component, automatically adds an id,
 * and returns the HTMLFormElement.
 *
 * Throws an error if the element with the id is not found
 * or is not a <form> element.
 *
 * @param Component The form component (e.g., AllgemeineAngabenForm)
 * @param props The props for the component (e.g., { defaultValues: ... })
 * @returns The form element itself to be passed on to fireEvent.submit(...)
 */
function renderForm<P>(Component: FormComponentType<P>, props: P) {
  const formId = "form-under-test";

  const { container } = render(<Component {...props} id={formId} />);

  const formElement = container.querySelector(`#${formId}`);

  if (!formElement) {
    throw new Error(`Unable to locate form "${formId}" in the dom.`);
  }

  if (!(formElement instanceof HTMLFormElement)) {
    throw new TypeError(
      `Element with id "${formId}" is not of type HTMLFormElement, but <${formElement.tagName}>.`,
    );
  }

  return formElement;
}

// re-export everything
export * from "@testing-library/react";

// override render method
export {
  renderForm,
  renderHookWithRedux as renderHook,
  renderWithRedux as render,
};

export const INITIAL_STATE: RootState = {
  stepAllgemeineAngaben: stepAllgemeineAngabenSlice.getInitialState(),
  stepNachwuchs: stepNachwuchsSlice.getInitialState(),
  stepErwerbstaetigkeit: stepErwerbstaetigkeitSlice.getInitialState(),
  stepEinkommen: stepEinkommenSlice.getInitialState(),
  feedback: feedbackSlice.getInitialState(),
  stepPrototyp: stepPrototypSlice.getInitialState(),
  routingPrototyp: routingPrototypSlice.getInitialState(),
};
