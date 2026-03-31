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

type Geschwisterbonus = {
  zuBeruecksichtigendeGeschwisterkinder: Temporal.PlainDate[];
  bonusGrund: string;
};

export function GeschwisterbonusUebersichtPage() {
  const { dispatch, findeVorherigenPfad, filtereValideEventHistorie } =
    useEventContext();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterbonusUebersicht;

  const eventStream = filtereValideEventHistorie();
  const geschwisterkinder = findeGeschwisterkinder(eventStream);
  const geburtsdatum = findeGeburtsdatum(eventStream);

  const geschwisterbonus = bestehtAnspruchAufGeschwisterbonus(
    geschwisterkinder,
    geburtsdatum,
  );

  const formatiereGeschwisterkinderFuerBonus = (
    geburtsdatenGeschwisterkinder: Temporal.PlainDate[],
  ): string => {
    return geburtsdatenGeschwisterkinder
      .map((date) => {
        const geburtsdatum = date.toLocaleString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return `Geschwisterkind (geboren ${geburtsdatum})`;
      })
      .join(" und ");
  };

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

              <h3>
                Super, voraussichtlich haben Sie Anspruch auf den
                Geschwisterbonus
              </h3>
            </div>

            <div className=" p-20">
              <ul className="ml-32 mt-4 list-disc">
                <li>
                  Berücksichtigt werden können die Angaben für{" "}
                  {formatiereGeschwisterkinderFuerBonus(
                    geschwisterbonus.zuBeruecksichtigendeGeschwisterkinder,
                  )}
                </li>
                <li>{geschwisterbonus.bonusGrund}</li>
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
                  Die Angaben der älteren Geschwisterkinder / des älteren
                  Geschwisterkindes hat ergeben, dass diese nicht für einen
                  Geschwisterbonus berücksichtigt werden können.
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

const bestehtAnspruchAufGeschwisterbonus = (
  geschwisterkinder: GeschwisterkindAngaben[],
  bezugsdatum: Temporal.PlainDate,
): Geschwisterbonus | false => {
  const relevanteKinder = geschwisterkinder
    .map((kind) => {
      const diff = bezugsdatum.since(kind.geburtsdatum, {
        largestUnit: "year",
      });
      return { ...kind, alter: diff.years };
    })
    .filter((kind) => (kind.hatBehinderung ? kind.alter < 14 : kind.alter < 6));

  if (relevanteKinder.length === 0) return false;

  if (relevanteKinder.some((k) => k.alter < 3)) {
    return {
      zuBeruecksichtigendeGeschwisterkinder: relevanteKinder.map(
        (k) => k.geburtsdatum,
      ),
      bonusGrund:
        "Sie haben ein Kind unter 3 Jahren - daher können Sie den Geschwisterbonus erhalten",
    };
  }

  const anzahlKinderUnter6 = relevanteKinder.filter((k) => k.alter < 6).length;
  if (anzahlKinderUnter6 >= 2) {
    return {
      zuBeruecksichtigendeGeschwisterkinder: relevanteKinder.map(
        (k) => k.geburtsdatum,
      ),
      bonusGrund:
        "Sie haben zwei Kinder unter 6 Jahren - daher können Sie den Geschwisterbonus erhalten",
    };
  }

  const hatKindMitBehinderungUnter14 = relevanteKinder.some(
    (k) => k.hatBehinderung && k.alter < 14,
  );
  if (hatKindMitBehinderungUnter14) {
    return {
      zuBeruecksichtigendeGeschwisterkinder: relevanteKinder.map(
        (k) => k.geburtsdatum,
      ),
      bonusGrund:
        "Sie haben ein Kind mit Behinderung unter 14 Jahren - daher können Sie den Geschwisterbonus erhalten",
    };
  }

  return false;
};

if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;

  describe("bestehtAnspruchAufGeschwisterbonus", () => {
    const geburtsdatum = Temporal.PlainDate.from("2024-05-02");
    const kindUnter3 = {
      geburtsdatum: Temporal.PlainDate.from("2021-05-03"),
      hatBehinderung: false,
    };
    const kindUnter6 = {
      geburtsdatum: Temporal.PlainDate.from("2018-05-03"),
      hatBehinderung: false,
    };
    const kindUeber6 = {
      geburtsdatum: Temporal.PlainDate.from("2018-05-01"),
      hatBehinderung: false,
    };
    const kindUnter14MitBehinderung = {
      geburtsdatum: Temporal.PlainDate.from("2010-05-03"),
      hatBehinderung: true,
    };

    it("sollte false zurückgeben, wenn keine Geschwisterkinder vorhanden sind", () => {
      expect(bestehtAnspruchAufGeschwisterbonus([], geburtsdatum)).toBe(false);
    });

    it("sollte den Bonus für ein Kind unter 3 Jahren erkennen", () => {
      const kinder = [kindUnter3, kindUnter6, kindUnter14MitBehinderung];
      const result = bestehtAnspruchAufGeschwisterbonus(kinder, geburtsdatum);

      expect(result).not.toBe(false);
      if (result) {
        expect(result.bonusGrund).toContain("ein Kind unter 3 Jahren");
      }
    });

    it("sollte den Bonus für zwei Kinder unter 6 Jahren erkennen", () => {
      const kinder = [kindUnter6, kindUnter6, kindUnter14MitBehinderung];
      const result = bestehtAnspruchAufGeschwisterbonus(kinder, geburtsdatum);

      expect(result).not.toBe(false);
      if (result) {
        expect(result.bonusGrund).toContain("zwei Kinder unter 6 Jahren");
      }
    });

    it("sollte den Bonus für ein Kind mit Behinderung unter 14 Jahren erkennen", () => {
      const kinder = [kindUeber6, kindUnter14MitBehinderung];
      const result = bestehtAnspruchAufGeschwisterbonus(kinder, geburtsdatum);

      expect(result).not.toBe(false);
      if (result) {
        expect(result.bonusGrund).toContain(
          "Kind mit Behinderung unter 14 Jahren",
        );
      }
    });

    it("sollte false zurückgeben, wenn die Kinder zu alt sind", () => {
      const kinder = [kindUeber6];
      expect(bestehtAnspruchAufGeschwisterbonus(kinder, geburtsdatum)).toBe(
        false,
      );
    });
  });
}
