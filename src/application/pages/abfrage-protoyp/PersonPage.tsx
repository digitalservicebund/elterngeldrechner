import { useId } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";

export function PersonPage() {
  const formIdentifier = useId();

  // const navigate = useNavigate();
  // const navigateToNachwuchsPage = () => navigate(formSteps.nachwuchs.route);

  return (
    <Page step={formSteps.person}>
      <div className="flex flex-col gap-56">
        <p>Lorem ipsum</p>

        <div>
          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
