import { VFC } from "react";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

export const RechnerCardHeaderEGPlus: VFC = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>ElterngeldPlus</h2>
          <span>(28 Monate verfügbar)</span>
        </div>
        <InfoDialog isLarge info={infoTexts.monatsplannerPlus} />
      </div>
      <div className={nsp("rechner-card__description")}>
        <ol>
          <li>
            Statt eines Lebensmonats Basiselterngeld 2 Lebensmonate
            ElterngeldPlus
          </li>
          <li>Halb so hoch wie Basiselterngeld</li>
          <li>
            Besonders lohnend, wenn Eltern nach der Geburt in Teilzeit arbeiten
          </li>
          <li>
            Auch nach dem 14. Lebensmonat, ab dann darf der Elterngeldbezug
            jedoch nicht mehr unterbrochen werden
          </li>
        </ol>
      </div>
    </div>
  );
};
