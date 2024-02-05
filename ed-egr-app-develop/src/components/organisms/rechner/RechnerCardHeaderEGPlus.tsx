import { VFC } from "react";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

export const RechnerCardHeaderEGPlus: VFC = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>ElterngeldPlus</h2>
          <p>(28 Monate verfügbar)</p>
        </div>
        <InfoDialog isLarge info={infoTexts.monatsplannerPlus} />
      </div>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>und Partnerschaftsbonus</h2>
          <p>(4 Monate verfügbar)</p>
        </div>
        <InfoDialog isLarge info={infoTexts.monatsplannerBonus} />
      </div>
      <div className={nsp("rechner-card__description")}>
        <section>
          <p>ElterngeldPlus</p>
          <ol>
            <li>
              Statt eines Lebensmonats Basiselterngeld 2 Lebensmonate
              ElterngeldPlus
            </li>
            <li>Halb so hoch wie Basiselterngeld</li>
            <li>
              Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit
              arbeiten
            </li>
            <li>
              Auch nach dem 14. Lebensmonat, ab dann darf der Elterngeldbezug
              jedoch nicht mehr unterbrochen werden
            </li>
          </ol>
        </section>
        <section>
          <p>Partnerschaftsbonus</p>
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
              Alleinerziehende können den Partnerschaftsbonus auch allein
              nutzen, wenn sie 24 bis 32 Stunden pro Woche arbeiten
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
};
