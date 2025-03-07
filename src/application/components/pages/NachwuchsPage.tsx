import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { NachwuchsForm } from "@/application/features/abfrageteil";
import {
  StepNachwuchsState,
  parseGermanDateString,
  stepNachwuchsSlice,
} from "@/application/features/abfrageteil/state";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";
import { trackNutzergruppe } from "@/application/user-tracking";

function NachwuchsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepNachwuchs);

  const handleSubmit = (values: StepNachwuchsState) => {
    dispatch(stepNachwuchsSlice.actions.submitStep(values));
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
