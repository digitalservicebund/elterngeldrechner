import { useNavigate } from "react-router";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { ErwerbstaetigkeitForm } from "@/application/features/abfrageteil";
import {
  StepErwerbstaetigkeitState,
  stepErwerbstaetigkeitSlice,
} from "@/application/features/abfrageteil/state";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";

function ErwerbstaetigkeitPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepErwerbstaetigkeit);

  const handleSubmit = (values: StepErwerbstaetigkeitState) => {
    dispatch(stepErwerbstaetigkeitSlice.actions.submitStep(values));
    navigate(formSteps.einkommen.route);
  };

  return (
    <Page step={formSteps.erwerbstaetigkeit}>
      <ErwerbstaetigkeitForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}

export default ErwerbstaetigkeitPage;
