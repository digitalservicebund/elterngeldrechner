import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  stepNachwuchsActions,
  StepNachwuchsState,
} from "@/redux/stepNachwuchsSlice";
import { NachwuchsForm } from "@/components/organisms";
import { formSteps } from "@/utils/formSteps";
import { Page } from "@/components/organisms/page";

function NachwuchsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = useAppSelector((state) => state.stepNachwuchs);

  const handleSubmit = (values: StepNachwuchsState) => {
    dispatch(stepNachwuchsActions.submitStep(values));
    navigate(formSteps.erwerbstaetigkeit.route);
  };

  return (
    <Page step={formSteps.nachwuchs}>
      <NachwuchsForm initialValues={initialValues} onSubmit={handleSubmit} />
    </Page>
  );
}

export default NachwuchsPage;
