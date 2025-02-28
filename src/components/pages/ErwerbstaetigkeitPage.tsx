import { useNavigate } from "react-router";
import { formSteps } from "./formSteps";
import { ErwerbstaetigkeitForm, Page } from "@/components/organisms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  StepErwerbstaetigkeitState,
  stepErwerbstaetigkeitActions,
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
