import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepEinkommenActions,
  StepEinkommenState,
} from "@/redux/stepEinkommenSlice";
import { stepRechnerActions } from "@/redux/stepRechnerSlice";
import { formSteps } from "@/utils/formSteps";
import { EinkommenForm } from "@/components/organisms";
import { Page } from "@/components/organisms/page";

const EinkommenPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepEinkommen);

  const [isFormDirty, setFormIsDirty] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({});

  const handleSubmit = (values: StepEinkommenState) => {
    // dirty check doesn't work on switch between average and monthly income - therefore additional checks added
    if (
      isFormDirty ||
      values.ET1.bruttoEinkommenNichtSelbstaendig.type !==
        initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type ||
      values.ET2.bruttoEinkommenNichtSelbstaendig.type !==
        initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type
    ) {
      dispatch(
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1:
            Object.hasOwn(dirtyFields, "ET1") ||
            values.ET1.bruttoEinkommenNichtSelbstaendig.type !==
              initialValues.ET1.bruttoEinkommenNichtSelbstaendig.type,
          ET2:
            Object.hasOwn(dirtyFields, "ET2") ||
            values.ET2.bruttoEinkommenNichtSelbstaendig.type !==
              initialValues.ET2.bruttoEinkommenNichtSelbstaendig.type,
        }),
      );
    }
    dispatch(stepEinkommenActions.submitStep(values));
    navigate(formSteps.elterngeldvarianten.route);
  };

  const handleDirtyForm = (isFormDirty: boolean, dirtyFields: object) => {
    setFormIsDirty(isFormDirty);
    setDirtyFields(dirtyFields);
  };

  return (
    <Page step={formSteps.einkommen}>
      <EinkommenForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        handleDirtyForm={handleDirtyForm}
      />
    </Page>
  );
};

export default EinkommenPage;
