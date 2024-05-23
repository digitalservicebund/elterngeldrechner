import { useState } from "react";
import { useNavigate } from "react-router";
import { AllgemeineAngabenForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepAllgemeineAngabenActions,
  StepAllgemeineAngabenState,
} from "@/redux/stepAllgemeineAngabenSlice";
import { formSteps } from "@/utils/formSteps";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";

function AllgemeineAngabenPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepAllgemeineAngaben);

  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleSubmit = (values: StepAllgemeineAngabenState) => {
    if (isFormDirty) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: true,
          ET2: true,
        }),
      );
    }
    dispatch(stepAllgemeineAngabenActions.submitStep(values));
    navigate(formSteps.nachwuchs.route);
  };

  const handleDirtyForm = (isFormDirty: boolean) => {
    setIsFormDirty(isFormDirty);
  };

  return (
    <Page step={formSteps.allgemeinAngaben}>
      <AllgemeineAngabenForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        handleDirtyForm={handleDirtyForm}
      />
    </Page>
  );
}

export default AllgemeineAngabenPage;
