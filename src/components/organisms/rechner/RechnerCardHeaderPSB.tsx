import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

export const RechnerCardHeaderPSB = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>Partnerschaftsbonus</h2>
          <span>(4 Monate verfügbar)</span>
        </div>
        <InfoDialog isLarge info={infoTexts.monatsplannerBonus} />
      </div>
      <div className={nsp("rechner-card__description")}>
        <ol>
          <li>
            2 bis 4 zusätzliche Lebensmonate Elterngeld-Plus, die direkt
            aufeinander folgen
          </li>
          <li>Die Eltern nutzen den Partnerschaftsbonus gleichzeitig</li>
          <li>
            Beide arbeiten in dieser Zeit in Teilzeit, also mindestens 24 und
            höchstens 32 Stunden pro Woche
          </li>
          <li>
            Alleinerziehende können den Partnerschaftsbonus auch allein nutzen,
            wenn sie 24 bis 32 Stunden pro Woche arbeiten
          </li>
        </ol>
      </div>
    </div>
  );
};
