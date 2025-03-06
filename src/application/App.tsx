import "@/application/styles/index.css";

import { configurationActions } from "@/application/redux/configurationSlice";
import { useAppDispatch } from "@/application/redux/hooks";
import Router from "@/application/routing/Router";

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
