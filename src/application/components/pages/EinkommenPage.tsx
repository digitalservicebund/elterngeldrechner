import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { EinkommenForm, Page } from "@/application/components/organisms";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";
import {
  StepEinkommenState,
  stepEinkommenSlice,
} from "@/application/redux/stepEinkommenSlice";

function EinkommenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepEinkommen);

  const handleSubmit = (values: StepEinkommenState) => {
    dispatch(stepEinkommenSlice.actions.submitStep(values));
    navigate(formSteps.elterngeldvarianten.route);
  };

  return (
    <Page step={formSteps.einkommen}>
      <EinkommenForm initialValues={initialValues} onSubmit={handleSubmit} />
    </Page>
  );
}

export default EinkommenPage;
