import { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { DatenfeldFuerMonat } from "./DatenfeldFuerMonat";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";
import {
  berechneZeitraumFuerLebensmonat,
  compareElternteile,
  listeLebensmonateAuf,
  type Ausgangslage,
  type ElternteileByAusgangslage,
  type Lebensmonate,
} from "@/features/planer/domain";

type Props<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
  readonly elternteileToShow: ElternteileByAusgangslage<A>[];
};

export function TabelleMitLebensmonaten<A extends Ausgangslage>({
  ausgangslage,
  lebensmonate,
  elternteileToShow,
}: Props<A>): ReactNode {
  return (
    <table className="w-full border-collapse [&_td]:pb-16 [&_th]:pb-16 [&_tr]:border-0 [&_tr]:border-b-2 [&_tr]:border-solid [&_tr]:border-grey-light">
      <thead>
        <tr className="text-left font-bold">
          <th scope="col">Lebensmonate</th>

          {elternteileToShow.sort(compareElternteile).map((elternteil) => {
            const pseudonym =
              ausgangslage.pseudonymeDerElternteile?.[elternteil];

            return (
              <th
                scope="col"
                abbr={pseudonym}
                className="pl-32 last:pr-8"
                key={elternteil}
              >
                <PersonIcon /> {pseudonym}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody className="[&_td]:pt-10 [&_th]:pt-10">
        {listeLebensmonateAuf(lebensmonate, true).map(
          ([lebensmonatszahl, lebensmonat]) => {
            const zeitraum = berechneZeitraumFuerLebensmonat(
              ausgangslage.geburtsdatumDesKindes,
              lebensmonatszahl,
            );

            return (
              <tr key={lebensmonatszahl}>
                <th
                  scope="row"
                  abbr={`${lebensmonatszahl}`}
                  className="flex items-center px-8 text-left font-regular"
                >
                  <div className="min-w-[3ch] font-bold">
                    {lebensmonatszahl}
                  </div>

                  <ZeitraumLabel
                    className="leading-tight"
                    zeitraum={zeitraum}
                    htmlElementType="div"
                  />
                </th>

                {elternteileToShow
                  .sort(compareElternteile)
                  .map((elternteil) => (
                    <td
                      className="pl-32 align-top last:pr-8"
                      key={`${elternteil}-${lebensmonatszahl}`}
                    >
                      <DatenfeldFuerMonat monat={lebensmonat[elternteil]} />
                    </td>
                  ))}
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  );
}
