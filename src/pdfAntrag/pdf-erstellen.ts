import { PDFDocument, rgb } from "@cantoo/pdf-lib";
import {
  Lebensmonatszahl,
  PlanMitBeliebigenElternteilen,
  Variante,
} from "@/monatsplaner";

interface InformationForPdfAntrag {
  nameET1: string;
  nameET2: string;
  anzahlKinder?: number;
  geburtsdatum?: string;
}

export async function preparePDF(
  completeForm: boolean,
  informationForPdfAntrag: InformationForPdfAntrag,
  plan: PlanMitBeliebigenElternteilen | undefined,
) {
  const formUrl = completeForm ? "antrag.pdf" : "seite.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  if (completeForm) {
    form
      .getTextField("1a Anzahl der Kinder")
      .setText(
        informationForPdfAntrag.anzahlKinder
          ? informationForPdfAntrag.anzahlKinder.toString()
          : "",
      );
    form
      .getTextField("1b Geburtsdatum Jahr")
      .setText(
        informationForPdfAntrag.geburtsdatum
          ? informationForPdfAntrag.geburtsdatum.toString()
          : "",
      );
  }

  if (plan?.ausgangslage?.anzahlElternteile === 2) {
    const nameET1 = informationForPdfAntrag.nameET1;
    const nameET2 = informationForPdfAntrag.nameET2;

    if (completeForm) {
      form.getTextField("2b Vorname(n) AS").setText(nameET1);
      form.getTextField("2b Vorname(n) 2E").setText(nameET2);
    } else {
      const pages = pdfDoc.getPages();
      const page = pages[0];
      if (page) {
        page.drawText(nameET1, {
          x: 65,
          y: 825,
          size: 10,
          color: rgb(0, 0, 0),
        });
        page.drawText(nameET2, {
          x: 325,
          y: 825,
          size: 10,
          color: rgb(0, 0, 0),
        });
      }
    }
  }

  for (let i = 1; i < 33; i++) {
    switch (
      plan?.lebensmonate[i as Lebensmonatszahl]?.["Elternteil 1"]
        .gewaehlteOption
    ) {
      case Variante.Basis:
        form.getCheckBox(`10 Basiselterngeld AS Monat ${i}`).check();
        break;
      case Variante.Plus:
        form.getCheckBox(`10 Elterngeld Plus AS Monat ${i}`).check();
        break;
      case Variante.Bonus:
        form.getCheckBox(`10 P-Bonus AS Monat ${i}`).check();
        break;
      default:
        break;
    }

    if (plan?.ausgangslage?.anzahlElternteile === 2) {
      switch (
        plan?.lebensmonate[i as Lebensmonatszahl]?.["Elternteil 2"]
          .gewaehlteOption
      ) {
        case Variante.Basis:
          form.getCheckBox(`10 Basiselterngeld 2E Monat ${i}`).check();
          break;
        case Variante.Plus:
          form.getCheckBox(`10 Elterngeld Plus 2E Monat ${i}`).check();
          break;
        case Variante.Bonus:
          form.getCheckBox(`10 P-Bonus 2E Monat ${i}`).check();
          break;
        default:
          break;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}
