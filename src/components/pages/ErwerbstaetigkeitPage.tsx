import { useNavigate } from "react-router";
import { formSteps } from "./formSteps";
import { Page } from "@/components/organisms/page";
import { ErwerbstaetigkeitForm } from "@/components/organisms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepErwerbstaetigkeitActions,
  StepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";

function ErwerbstaetigkeitPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepErwerbstaetigkeit);

  const handleSubmit = (values: StepErwerbstaetigkeitState) => {
    dispatch(stepErwerbstaetigkeitActions.submitStep(values));
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
