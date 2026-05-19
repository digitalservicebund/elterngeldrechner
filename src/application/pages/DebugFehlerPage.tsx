import { useState } from "react";

export function DebugFehlerPage() {
  const [fehlerAusloesen, setFehlerAusloesen] = useState(false);

  if (fehlerAusloesen) {
    throw new Error("PostHog Fehlererfassung – manueller Test");
  }

  return (
    <div className="page-grid-container">
      <div className="page-grid-content">
        <h2 className="mb-10">Fehlererfassung testen</h2>
        <p className="mb-10">
          Löst einen Fehler aus, der über die ErrorBoundary an PostHog
          weitergeleitet wird.
        </p>
        <button
          type="button"
          className="text-primary underline"
          onClick={() => setFehlerAusloesen(true)}
        >
          Fehler auslösen
        </button>
      </div>
    </div>
  );
}
