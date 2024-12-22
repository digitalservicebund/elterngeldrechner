import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepNachwuchsActions,
  parseGermanDateString,
  StepNachwuchsState,
} from "@/redux/stepNachwuchsSlice";
import { NachwuchsForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import { trackNutzergruppe } from "@/user-tracking";

function NachwuchsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepNachwuchs);

  const handleSubmit = (values: StepNachwuchsState) => {
    dispatch(stepNachwuchsActions.submitStep(values));
    trackNutzergruppe(
      parseGermanDateString(values.wahrscheinlichesGeburtsDatum),
    );
    navigate(formSteps.erwerbstaetigkeit.route);
  };

  return (
    <Page step={formSteps.nachwuchs}>
      <NachwuchsForm initialValues={initialValues} onSubmit={handleSubmit} />
    </Page>
  );
}

export default NachwuchsPage;
