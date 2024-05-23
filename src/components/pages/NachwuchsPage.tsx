import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepNachwuchsActions,
  StepNachwuchsState,
} from "@/redux/stepNachwuchsSlice";
import { NachwuchsForm } from "@/components/organisms";
import { formSteps } from "@/utils/formSteps";
import { Page } from "@/components/organisms/page";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";

function NachwuchsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepNachwuchs);

  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleSubmit = (values: StepNachwuchsState) => {
    if (isFormDirty) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: true,
          ET2: true,
        }),
      );
    }
    dispatch(stepNachwuchsActions.submitStep(values));
    navigate(formSteps.erwerbstaetigkeit.route);
  };

  const handleDirtyForm = (isFormDirty: boolean) => {
    setIsFormDirty(isFormDirty);
  };

  return (
    <Page step={formSteps.nachwuchs}>
      <NachwuchsForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        handleDirtyForm={handleDirtyForm}
      />
    </Page>
  );
}

export default NachwuchsPage;
