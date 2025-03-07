import { useNavigate } from "react-router";
import { formSteps } from "./formSteps";
import {
  AllgemeineAngabenForm,
  Page,
} from "@/application/components/organisms";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";
import {
  StepAllgemeineAngabenState,
  stepAllgemeineAngabenSlice,
} from "@/application/redux/stepAllgemeineAngabenSlice";

function AllgemeineAngabenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepAllgemeineAngaben);

  const handleSubmit = (values: StepAllgemeineAngabenState) => {
    dispatch(stepAllgemeineAngabenSlice.actions.submitStep(values));
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
