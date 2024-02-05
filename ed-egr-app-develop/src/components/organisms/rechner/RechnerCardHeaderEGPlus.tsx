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
              Besonders lohnend, wenn Sie nach der Geburt in Teilzeit arbeiten
            </li>
            <li>
              Auch nach dem 14. Lebensmonat, ab dann dürfen Sie den
              Elterngeldbezug jedoch nicht mehr unterbrechen
            </li>
          </ol>
        </section>
        <section>
          <p>Partnerschaftsbonus</p>
          <ol>
            <li>Zusätzliche ElterngeldPlus-Monate</li>
            <li>
              Muss von beiden Elternteilen gleichzeitig genutzt werden -
              Alleinerziehende können den Partnerschaftsbonus allein bekommen
            </li>
            <li>
              In dieser Zeit arbeiten beide Elternteile in Teilzeit, also
              mindestens 24 und höchstens 32 Stunden pro Woche
            </li>
            <li>Mindestens 2 und höchstens 4 Lebensmonate</li>
          </ol>
        </section>
      </div>
    </div>
  );
};
