import { Component, type ErrorInfo, type ReactNode } from "react";
import { pushTrackingEvent } from "@/application/user-tracking/core";

type Props = { readonly children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, _info: ErrorInfo): void {
    pushTrackingEvent("unbehandelter-fehler", {
      data: { fehlernachricht: error.message },
    });
  }

  override render(): ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? <ErrorFallback /> : children;
  }
}

function ErrorFallback() {
  return (
    <div className="page-grid-container">
      <div className="page-grid-content">
        <h2 className="mb-10">Es tut uns leid</h2>

        <p className="mb-10">
          Im Elterngeldrechner ist ein Fehler aufgetreten. Bitte starten Sie den
          Rechner neu.
        </p>

        <a href={window.location.pathname} className="text-primary underline">
          Neu starten
        </a>
      </div>
    </div>
  );
}
