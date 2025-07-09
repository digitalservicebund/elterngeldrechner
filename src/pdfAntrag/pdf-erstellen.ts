import { PDFDocument, rgb } from "@cantoo/pdf-lib";
import { getFieldNames, getPdfFileName } from "./pdf-versions";
import {
  Lebensmonatszahl,
  PlanMitBeliebigenElternteilen,
  Variante,
} from "@/monatsplaner";

interface InformationForPdfAntrag {
  nameET1: string;
  nameET2: string;
  geburtsdatum: Date;
}

export async function preparePDF(
  completeForm: boolean,
  informationForPdfAntrag: InformationForPdfAntrag,
  plan: PlanMitBeliebigenElternteilen | undefined,
) {
  const birthday = new Date(informationForPdfAntrag.geburtsdatum);

  const fieldNames = getFieldNames(birthday);
  if (fieldNames === null) {
    throw Error("No set of field names available for selected birthday.");
  }

  const pdfDoc = await getPdfDocument(completeForm, birthday);
  if (pdfDoc === null) {
    throw Error("No pdf available for selected birthday.");
  }

  const form = pdfDoc.getForm();

  // const fields = form.getFields()
  // fields.forEach(field => {
  //   const type = field.constructor.name
  //   const name = field.getName()
  //   console.log(`${type}: ${name}`)
  // })

  if (completeForm && plan?.ausgangslage?.anzahlElternteile === 2) {
    form
      .getTextField(fieldNames.vornameET1)
      .setText(informationForPdfAntrag.nameET1);
    form
      .getTextField(fieldNames.vornameET2)
      .setText(informationForPdfAntrag.nameET2);
  }

  if (!completeForm && plan?.ausgangslage?.anzahlElternteile === 2) {
    const pages = pdfDoc.getPages();
    const page = pages[0];
    if (page) {
      page.drawText(informationForPdfAntrag.nameET1, {
        x: 65,
        y: 825,
        size: 10,
        color: rgb(0, 0, 0),
      });
      page.drawText(informationForPdfAntrag.nameET2, {
        x: 325,
        y: 825,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }
  }

  for (let i = 1; i < 33; i++) {
    switch (
      plan?.lebensmonate[i as Lebensmonatszahl]?.["Elternteil 1"]
        .gewaehlteOption
    ) {
      case Variante.Basis:
        form.getCheckBox(`${fieldNames.basisET1} ${i}`).check();
        break;
      case Variante.Plus:
        form.getCheckBox(`${fieldNames.plusET1} ${i}`).check();
        break;
      case Variante.Bonus:
        form.getCheckBox(`${fieldNames.bonusET1} ${i}`).check();
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
          form.getCheckBox(`${fieldNames.basisET2} ${i}`).check();
          break;
        case Variante.Plus:
          form.getCheckBox(`${fieldNames.plusET2} ${i}`).check();
          break;
        case Variante.Bonus:
          form.getCheckBox(`${fieldNames.bonusET2} ${i}`).check();
          break;
        default:
          break;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}

async function getPdfDocument(completeForm: boolean, birthday: Date) {
  const baseUrl = getPdfFileName(birthday);
  if (baseUrl === null) {
    return null;
  }

  const formUrl = completeForm
    ? `${baseUrl}_antrag.pdf`
    : `${baseUrl}_seite.pdf`;

  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  return pdfDoc;
}
