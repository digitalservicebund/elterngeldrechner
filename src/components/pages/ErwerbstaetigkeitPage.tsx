import { useNavigate } from "react-router";
import { Page } from "@/components/organisms/page";
import { ErwerbstaetigkeitForm } from "@/components/organisms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepErwerbstaetigkeitActions,
  StepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { formSteps } from "@/utils/formSteps";

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
