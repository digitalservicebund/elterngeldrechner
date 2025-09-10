import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";

export function EinfuehrungsPage() {
  const navigate = useNavigate();
  const navigateToKindPage = () => navigate(formSteps.kind.route);

  return (
    <Page step={formSteps.einfuehrung}>
      <div className="flex flex-col gap-56">
        <p>Lorem ipsum</p>

        <div>
          <Button type="submit" onClick={navigateToKindPage}>
            Verstanden und Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
