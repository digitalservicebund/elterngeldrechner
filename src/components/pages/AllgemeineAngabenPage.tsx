import { FC, useState } from "react";
import { AllgemeineAngabenForm } from "../organisms";
import { Page } from "../organisms/page";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  stepAllgemeineAngabenActions,
  StepAllgemeineAngabenState,
} from "../../redux/stepAllgemeineAngabenSlice";
import { useNavigate } from "react-router";
import { formSteps } from "../../utils/formSteps";
import { stepRechnerActions } from "../../redux/stepRechnerSlice";

const AllgemeineAngabenPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepAllgemeineAngaben);

  const [isFormDirty, setFormIsDirty] = useState(false);

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
    setFormIsDirty(isFormDirty);
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
};

export default AllgemeineAngabenPage;
