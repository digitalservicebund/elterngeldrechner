import "@/styles/index.css";

import { configurationActions } from "@/redux/configurationSlice";
import { useAppDispatch } from "@/redux/hooks";

import Router from "@/routing/Router";

interface Props {
  readonly elternGeldDigitalWizardUrl: string | undefined;
}

export function App({ elternGeldDigitalWizardUrl }: Props) {
  const dispatch = useAppDispatch();

  dispatch(
    configurationActions.configure({
      elternGeldDigitalWizardUrl: elternGeldDigitalWizardUrl,
    }),
  );

  return <Router />;
}
