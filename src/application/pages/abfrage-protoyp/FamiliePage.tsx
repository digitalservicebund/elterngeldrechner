import { useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { FamilieForm } from "@/application/features/abfrage-prototyp";
import {
  RoutingPrototypState,
  routingPrototypSlice,
} from "@/application/features/abfrage-prototyp/state";
import { KindPageRoutes } from "@/application/features/abfrage-prototyp/state/routingPrototypSlice";
import { Page } from "@/application/pages/Page";
import { RootState } from "@/application/redux";
import { formSteps } from "@/application/routing/formSteps";

export function FamiliePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formIdentifier = useId();

  const routerState = useSelector((state: RootState) => state.routingPrototyp);

  const onForwardRouting = () => {
    const data: RoutingPrototypState = {
      ...routerState,
      currentKindPageRoute: KindPageRoutes.ABFRAGE_GEBURT,
    };
    dispatch(routingPrototypSlice.actions.submitRouting(data));

    void navigate(formSteps.kind.route);
  };

  return (
    <Page step={formSteps.familie}>
      <div className="flex flex-col gap-56">
        <FamilieForm
          id={formIdentifier}
          onSubmit={onForwardRouting}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={() => navigate(formSteps.einfuehrung.route)}
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
