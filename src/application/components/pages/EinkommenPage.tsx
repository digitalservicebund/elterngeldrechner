import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { EinkommenForm } from "@/application/features/abfrageteil";
import {
  StepEinkommenState,
  stepEinkommenSlice,
} from "@/application/features/abfrageteil/state";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";

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
