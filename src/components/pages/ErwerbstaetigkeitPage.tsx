import { useNavigate } from "react-router";
import { useState } from "react";
import { Page } from "@/components/organisms/page";
import { ErwerbstaetigkeitForm } from "@/components/organisms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepErwerbstaetigkeitActions,
  StepErwerbstaetigkeitState,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { formSteps } from "@/utils/formSteps";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";

const ErwerbstaetigkeitPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepErwerbstaetigkeit);

  const [isFormDirty, setFormIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({});

  const handleSubmit = (values: StepErwerbstaetigkeitState) => {
    // dirty check doesn't work on vorGeburt field - therefore additional checks added
    if (
      isFormDirty ||
      values.ET1.vorGeburt !== initialValues.ET1.vorGeburt ||
      values.ET2.vorGeburt !== initialValues.ET2.vorGeburt
    ) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1:
            Object.hasOwn(dirtyFields, "ET1") ||
            values.ET1.vorGeburt !== initialValues.ET1.vorGeburt,
          ET2:
            Object.hasOwn(dirtyFields, "ET2") ||
            values.ET2.vorGeburt !== initialValues.ET2.vorGeburt,
        }),
      );
    }
    dispatch(stepErwerbstaetigkeitActions.submitStep(values));
    navigate(formSteps.einkommen.route);
  };

  const handleDirtyForm = (isFormDirty: boolean, dirtyFields: object) => {
    setFormIsDirty(isFormDirty);
    setDirtyFields(dirtyFields);
  };

  return (
    <Page step={formSteps.erwerbstaetigkeit}>
      <ErwerbstaetigkeitForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        handleDirtyForm={handleDirtyForm}
      />
    </Page>
  );
};

export default ErwerbstaetigkeitPage;
