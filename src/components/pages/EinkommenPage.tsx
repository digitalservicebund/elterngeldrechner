import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { EinkommenForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  StepEinkommenState,
  stepEinkommenActions,
} from "@/redux/stepEinkommenSlice";

function EinkommenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepEinkommen);

  const handleSubmit = (values: StepEinkommenState) => {
    dispatch(stepEinkommenActions.submitStep(values));
    navigate(formSteps.elterngeldvarianten.route);
  };

  return (
    <Page step={formSteps.einkommen}>
      <EinkommenForm initialValues={initialValues} onSubmit={handleSubmit} />
    </Page>
  );
}

export default EinkommenPage;
