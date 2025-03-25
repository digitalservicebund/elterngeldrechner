import "@/application/styles/index.css";

import { configurationSlice } from "@/application/redux/configurationSlice";
import { useAppDispatch } from "@/application/redux/hooks";
import Router from "@/application/routing/Router";

type Props = {
  readonly elternGeldDigitalWizardUrl: string | undefined;
};

export function App({ elternGeldDigitalWizardUrl }: Props) {
  const dispatch = useAppDispatch();

  dispatch(
    configurationSlice.actions.configure({
      elternGeldDigitalWizardUrl: elternGeldDigitalWizardUrl,
    }),
  );

  return <Router />;
}
