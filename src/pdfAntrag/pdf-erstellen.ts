import { PDFDocument, rgb } from "@cantoo/pdf-lib";
import {
  getFieldName,
  getFieldNameForVornamen,
  getPdfVersion,
} from "./pdf-versions";
import {
  Elternteil,
  Lebensmonatszahl,
  PlanMitBeliebigenElternteilen,
  Variante,
} from "@/monatsplaner";

interface InformationForPdfAntrag {
  nameET1: string;
  nameET2: string;
  geburtsdatum: Date;
}

export async function preparePDF(options: {
  completeForm: boolean;
  informationForPdfAntrag: InformationForPdfAntrag;
  plan: PlanMitBeliebigenElternteilen | undefined;
}) {
  const { completeForm, informationForPdfAntrag, plan } = options;

  const pdfDoc = await getPdfDocument(
    completeForm,
    informationForPdfAntrag.geburtsdatum,
  );
  const form = pdfDoc.getForm();

  if (completeForm && plan?.ausgangslage?.anzahlElternteile === 2) {
    form
      .getTextField(
        getFieldNameForVornamen(informationForPdfAntrag.geburtsdatum)[
          Elternteil.Eins
        ],
      )
      .setText(informationForPdfAntrag.nameET1);
    form
      .getTextField(
        getFieldNameForVornamen(informationForPdfAntrag.geburtsdatum)[
          Elternteil.Zwei
        ],
      )
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
        form
          .getCheckBox(
            getFieldName({
              geburtsdatum: informationForPdfAntrag.geburtsdatum,
              variante: Variante.Basis,
              elternteil: Elternteil.Eins,
              lebensmonat: i as Lebensmonatszahl,
            }),
          )
          .check();
        break;
      case Variante.Plus:
        form
          .getCheckBox(
            getFieldName({
              geburtsdatum: informationForPdfAntrag.geburtsdatum,
              variante: Variante.Plus,
              elternteil: Elternteil.Eins,
              lebensmonat: i as Lebensmonatszahl,
            }),
          )
          .check();
        break;
      case Variante.Bonus:
        form
          .getCheckBox(
            getFieldName({
              geburtsdatum: informationForPdfAntrag.geburtsdatum,
              variante: Variante.Bonus,
              elternteil: Elternteil.Eins,
              lebensmonat: i as Lebensmonatszahl,
            }),
          )
          .check();
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
          form
            .getCheckBox(
              getFieldName({
                geburtsdatum: informationForPdfAntrag.geburtsdatum,
                variante: Variante.Basis,
                elternteil: Elternteil.Zwei,
                lebensmonat: i as Lebensmonatszahl,
              }),
            )
            .check();
          break;
        case Variante.Plus:
          form
            .getCheckBox(
              getFieldName({
                geburtsdatum: informationForPdfAntrag.geburtsdatum,
                variante: Variante.Plus,
                elternteil: Elternteil.Zwei,
                lebensmonat: i as Lebensmonatszahl,
              }),
            )
            .check();
          break;
        case Variante.Bonus:
          form
            .getCheckBox(
              getFieldName({
                geburtsdatum: informationForPdfAntrag.geburtsdatum,
                variante: Variante.Bonus,
                elternteil: Elternteil.Zwei,
                lebensmonat: i as Lebensmonatszahl,
              }),
            )
            .check();
          break;
        default:
          break;
      }
    }
  }

  return await pdfDoc.save();
}

async function getPdfDocument(completeForm: boolean, geburtsdatum: Date) {
  const pdfVersion = getPdfVersion(geburtsdatum);
  if (!pdfVersion) {
    throw Error("PDF Version not found");
  }

  const formUrl = completeForm
    ? `${pdfVersion.pdfFileName}_antrag.pdf`
    : `${pdfVersion.pdfFileName}_seite.pdf`;

  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  return pdfDoc;
}
