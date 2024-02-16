import { VFC } from "react";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";
import { Alert } from "../../molecules";

export const RechnerCardHeaderBEG: VFC = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>Basiselterngeld</h2>
          <p>(14 Monate verfügbar)</p>
        </div>
        <InfoDialog isLarge={true} info={infoTexts.monatsplannerBasis} />
      </div>
      <div className={nsp("rechner-card__description")}>
        <ol>
          <li>Für bis zu 12 Lebensmonate Ihres Kindes</li>
          <li>
            2 zusätzliche Monate, wenn beide Elternteile Elterngeld beantragen
            und mindestens ein Elternteil nach der Geburt weniger Einkommen hat
            (Partnermonate)
          </li>
          <li>
            Monate können nach den Wünschen der Eltern untereinander aufgeteilt
            werden
          </li>
          <li>Alleinerziehende können die Partnermonate auch bekommen</li>
        </ol>

        <div style={{ marginTop: "1rem" }}>
          <Alert headline="Für Geburten ab dem 01.04.2024 gibt es neue Regelungen für den parallelen Bezug von Basiselterngeld:">
            <p>
              Bitte informieren Sie sich auf der{" "}
              <a
                href="https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld/elterngeld-73752"
                target="_blank"
                rel="noreferrer"
              >
                Seite des Bundes-Familienministeriums
              </a>
              .
            </p>
          </Alert>
        </div>
      </div>
    </div>
  );
};
