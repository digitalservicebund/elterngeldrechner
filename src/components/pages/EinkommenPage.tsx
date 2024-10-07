import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepEinkommenActions,
  StepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import { formSteps } from "@/utils/formSteps";
import { EinkommenForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";

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
