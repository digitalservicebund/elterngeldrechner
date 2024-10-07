import { useNavigate } from "react-router";
import { AllgemeineAngabenForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepAllgemeineAngabenActions,
  StepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import { formSteps } from "@/utils/formSteps";

function AllgemeineAngabenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepAllgemeineAngaben);

  const handleSubmit = (values: StepAllgemeineAngabenState) => {
    dispatch(stepAllgemeineAngabenActions.submitStep(values));
    navigate(formSteps.nachwuchs.route);
  };

  return (
    <Page step={formSteps.allgemeinAngaben}>
      <AllgemeineAngabenForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </Page>
  );
}

export default AllgemeineAngabenPage;
