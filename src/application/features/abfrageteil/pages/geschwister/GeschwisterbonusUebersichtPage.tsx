import SuccessIcon from "~icons/material-symbols/check-circle-outline";
import InfoIcon from "~icons/material-symbols/info-outline";
import { Temporal } from "@js-temporal/polyfill";
import { useNavigate } from "react-router";
import { GeschwisterkindAngaben } from "./GeschwisterSchema";
import { InfoTextGeschwisterbonus } from "./InfoTextGeschwisterbonus";
import { Button } from "@/application/features/components";
import { Page } from "@/application/features/components";
import { findeGeburtsdatum } from "@/application/features/abfrageteil/domain/findeGeburtsdatum";
import { findeGeschwisterkinder } from "@/application/features/abfrageteil/domain/findeGeschwisterkinder";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";

export function GeschwisterbonusUebersichtPage() {
  const { dispatch, findeVorherigenPfad, filtereValideEventHistorie } =
    useEventContext();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterbonusUebersicht;

  const eventStream = filtereValideEventHistorie();
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatum = findeGeburtsdatum(eventStream);

  const geschwisterbonus = berechneEnddatumGeschwisterbonus(
    geschwisterkinder,
    geburtsdatum,
  );

  const navigateNextPage = () => {
    const event: FormEvent = {
      route: currentRoute,
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute));
  };

  return (
    <Page heading="Angaben zu Geschwistern">
      <div className="mt-40 flex flex-col gap-40">
        {geschwisterbonus ? (
          <div className="rounded border-solid border-success">
            <div className="flex rounded bg-success-background p-20 font-bold">
              <SuccessIcon className="mr-10 mt-8 shrink-0 text-success" />

              <h3>Super, Sie können den Geschwisterbonus erhalten</h3>
            </div>

            <div className=" p-20">
              <ul className="ml-32 mt-4 list-disc">
                <li>
                  Ihre Angaben haben ergeben, dass die Voraussetzungen für den
                  Geschwisterbonus erfüllt sind
                </li>
                <li>
                  Der Geschwisterbonus wird bis zum Erreichen der{" "}
                  <strong>
                    Altersgrenze am{" "}
                    {geschwisterbonus.toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </strong>{" "}
                  gezahlt
                </li>
                <li>
                  Die Erhöhung wird im Planer direkt bei ihrem Elterngeld
                  berücksichtigt
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded border-solid border-info">
            <div className="flex rounded bg-info-background p-20 font-bold">
              <InfoIcon className="mr-10 mt-8 shrink-0 text-info" />

              <h3>Sie erhalten keinen Geschwisterbonus</h3>
            </div>

            <div className=" p-20">
              <ul className="ml-32 mt-4 list-disc">
                <li>
                  Ihre Angaben haben ergeben, dass die Altersgrenze für den
                  Geschwisterbonus überschritten ist.
                </li>
              </ul>
            </div>
          </div>
        )}

        <InfoTextGeschwisterbonus question="Was ist der Geschwisterbonus?" />

        <div className="mt-40 flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button
            type="button"
            buttonStyle="primary"
            onClick={navigateNextPage}
          >
            Verstanden und weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}

const berechneEnddatumGeschwisterbonus = (
  geschwisterkinder: GeschwisterkindAngaben[],
  geburtsdatumNeugeborenes: Temporal.PlainDate,
): Temporal.PlainDate | null => {
  if (geschwisterkinder.length === 0) return null;

  const letzterTagDesMonats = (date: Temporal.PlainDate) =>
    date.with({ day: date.daysInMonth });

  const geschwisterkinderMitGeburtsdaten = geschwisterkinder.map((kind) => ({
    dritterGeburtstag: kind.geburtsdatum.add({ years: 3 }),
    sechsterGeburtstag: kind.geburtsdatum.add({ years: 6 }),
    vierzehnterGeburtstag: kind.geburtsdatum.add({ years: 14 }),
    hatBehinderung: kind.hatBehinderung,
  }));

  const moeglicheEnddaten: Temporal.PlainDate[] = [];

  const juengstesGeschwisterkindWirdDrei = geschwisterkinderMitGeburtsdaten
    .filter(
      (kind) =>
        Temporal.PlainDate.compare(
          kind.dritterGeburtstag,
          geburtsdatumNeugeborenes,
        ) > 0,
    )
    .map((kind) => letzterTagDesMonats(kind.dritterGeburtstag))
    .sort(void Temporal.PlainDate.compare)
    .at(-1);

  if (juengstesGeschwisterkindWirdDrei) {
    moeglicheEnddaten.push(juengstesGeschwisterkindWirdDrei);
  }

  const sechsteGeburtstage = geschwisterkinderMitGeburtsdaten
    .filter(
      (kind) =>
        Temporal.PlainDate.compare(
          kind.sechsterGeburtstag,
          geburtsdatumNeugeborenes,
        ) > 0,
    )
    .map((kind) => letzterTagDesMonats(kind.sechsterGeburtstag))
    .sort(void Temporal.PlainDate.compare);

  if (sechsteGeburtstage.length >= 2) {
    const zweitJuengstesGeschwisterkindWirdSechs =
      sechsteGeburtstage[sechsteGeburtstage.length - 2];

    if (zweitJuengstesGeschwisterkindWirdSechs)
      moeglicheEnddaten.push(zweitJuengstesGeschwisterkindWirdSechs);
  }

  const juengstesGeschwisterkindMitBehinderungWirdVierzehn =
    geschwisterkinderMitGeburtsdaten
      .filter(
        (kind) =>
          kind.hatBehinderung &&
          Temporal.PlainDate.compare(
            kind.vierzehnterGeburtstag,
            geburtsdatumNeugeborenes,
          ) > 0,
      )
      .map((kind) => letzterTagDesMonats(kind.vierzehnterGeburtstag))
      .sort(void Temporal.PlainDate.compare)
      .at(-1);

  if (juengstesGeschwisterkindMitBehinderungWirdVierzehn) {
    moeglicheEnddaten.push(juengstesGeschwisterkindMitBehinderungWirdVierzehn);
  }

  if (moeglicheEnddaten.length === 0) return null;

  return moeglicheEnddaten.reduce((max, aktuell) =>
    Temporal.PlainDate.compare(aktuell, max) > 0 ? aktuell : max,
  );
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("berechneEnddatumGeschwisterbonus", () => {
    const geburtsdatumNeugeborenes = Temporal.PlainDate.from("2024-05-02");
    const kindUnter3 = {
      geburtsdatum: Temporal.PlainDate.from("2022-05-15"),
      hatBehinderung: false,
    };
    const kindUnter6 = {
      geburtsdatum: Temporal.PlainDate.from("2019-08-10"),
      hatBehinderung: false,
    };
    const zweitesKindUnter6 = {
      geburtsdatum: Temporal.PlainDate.from("2020-11-20"),
      hatBehinderung: false,
    };
    const kindUeber6 = {
      geburtsdatum: Temporal.PlainDate.from("2018-05-01"),
      hatBehinderung: false,
    };
    const kindUnter14MitBehinderung = {
      geburtsdatum: Temporal.PlainDate.from("2011-10-05"),
      hatBehinderung: true,
    };

    it("sollte null zurückgeben, wenn keine Geschwisterkinder vorhanden sind", () => {
      expect(
        berechneEnddatumGeschwisterbonus([], geburtsdatumNeugeborenes),
      ).toBe(null);
    });

    it("sollte das Ende des Monats berechnen, in dem das einzige Geschwisterkind 3 Jahre alt wird", () => {
      const kinder = [kindUnter3];
      const result = berechneEnddatumGeschwisterbonus(
        kinder,
        geburtsdatumNeugeborenes,
      );

      expect(result?.toString()).toBe("2025-05-31");
    });

    it("sollte bei zwei Geschwistern unter 6 das Ende des Monats berechnen, in dem eins der Geschwisterkinder 6 Jahre alt wird", () => {
      const kinder = [kindUnter6, zweitesKindUnter6];
      const result = berechneEnddatumGeschwisterbonus(
        kinder,
        geburtsdatumNeugeborenes,
      );

      expect(result?.toString()).toBe("2025-08-31");
    });

    it("sollte das Ende des Monats berechnen, in dem ein Geschwisterkind mit Behinderung 14 Jahre alt wird", () => {
      const kinder = [kindUnter14MitBehinderung];
      const result = berechneEnddatumGeschwisterbonus(
        kinder,
        geburtsdatumNeugeborenes,
      );

      expect(result?.toString()).toBe("2025-10-31");
    });

    it("sollte den spätestmöglichen Termin wählen bei mehreren Kindern, die für Bonus relevant sind", () => {
      const kinder = [kindUnter3, kindUnter14MitBehinderung];
      const result = berechneEnddatumGeschwisterbonus(
        kinder,
        geburtsdatumNeugeborenes,
      );

      expect(result?.toString()).toBe("2025-10-31");
    });

    it("sollte null zurückgeben, wenn alle Kinder bereits aus den Altersgrenzen gefallen sind", () => {
      const kinder = [kindUeber6];
      const result = berechneEnddatumGeschwisterbonus(
        kinder,
        geburtsdatumNeugeborenes,
      );

      expect(result).toBe(null);
    });
  });
}
