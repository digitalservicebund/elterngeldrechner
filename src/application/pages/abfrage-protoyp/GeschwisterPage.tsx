import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { GeschwisterAbfrageForm } from "@/application/features/abfrage-prototyp/components/GeschwisterPage/GeschwisterAbfrageForm";
import { GeschwisterAngabenForm } from "@/application/features/abfrage-prototyp/components/GeschwisterPage/GeschwisterAngabenForm";
import {
  RoutingPrototypState,
  StepPrototypState,
  routingPrototypSlice,
  stepPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { YesNo } from "@/application/features/abfrageteil/state";
import { Page } from "@/application/pages/Page";
import { RootState } from "@/application/redux";
import { formSteps } from "@/application/routing/formSteps";

export function GeschwisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formIdentifier = useId();

  const routerState = useSelector((state: RootState) => state.routingPrototyp);
  const currentGeschwisterPageRoute = routerState.currentGeschwisterPageRoute;

  const onForwardRouting = (values: StepPrototypState) => {
    const esGibtGeschwister = values.geschwister.esGibtGeschwister;

    if (esGibtGeschwister[currentGeschwisterPageRoute] === YesNo.NO) {
      void navigate(formSteps.person1.route);
      return;
    } else {
      const nextEsGibtGeschwister = [...esGibtGeschwister, null];
      const nextGeschwisterState = {
        ...values.geschwister,
        esGibtGeschwister: nextEsGibtGeschwister,
      };
      const newValues: StepPrototypState = {
        ...values,
        geschwister: nextGeschwisterState,
      };
      dispatch(stepPrototypSlice.actions.submitStep(newValues));

      const data: RoutingPrototypState = {
        ...routerState,
        currentGeschwisterPageRoute: currentGeschwisterPageRoute + 1,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }
  };

  const onBackwardRouting = () => {
    if (currentGeschwisterPageRoute === 0) {
      void navigate(formSteps.kind.route);
      return;
    } else {
      const data: RoutingPrototypState = {
        ...routerState,
        currentGeschwisterPageRoute: currentGeschwisterPageRoute - 1,
      };
      dispatch(routingPrototypSlice.actions.submitRouting(data));
    }
  };

  return (
    <Page step={formSteps.geschwister}>
      <div className="flex flex-col gap-56">
        {currentGeschwisterPageRoute === 0 && (
          <GeschwisterAbfrageForm
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
          />
        )}

        {currentGeschwisterPageRoute > 0 && (
          <GeschwisterAngabenForm
            key={currentGeschwisterPageRoute}
            geschwisterIndex={currentGeschwisterPageRoute}
            id={formIdentifier}
            onSubmit={onForwardRouting}
            hideSubmitButton
          />
        )}

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={onBackwardRouting}
          >
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
