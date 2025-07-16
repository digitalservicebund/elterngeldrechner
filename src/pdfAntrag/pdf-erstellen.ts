import { PDFDocument, PDFForm, rgb } from "@cantoo/pdf-lib";
import {
  getFieldName,
  getFieldNameForVornamen,
  getPdfVersion,
} from "./pdf-versions";
import {
  Elternteil,
  Lebensmonatszahl,
  PlanMitBeliebigenElternteilen,
} from "@/monatsplaner";

interface InformationForPdfAntrag {
  nameET1: string;
  nameET2: string;
  geburtsdatum: Date;
}

export async function prepareGanzerAntrag({
  informationForPdfAntrag,
  plan,
}: {
  informationForPdfAntrag: InformationForPdfAntrag;
  plan: PlanMitBeliebigenElternteilen | undefined;
}) {
  const pdfDoc = await getPdfDocument({
    completeForm: true,
    geburtsdatum: informationForPdfAntrag.geburtsdatum,
  });
  const form = pdfDoc.getForm();

  fillCheckboxes({
    elternteil: Elternteil.Eins,
    geburtsdatum: informationForPdfAntrag.geburtsdatum,
    form,
    plan,
  });

  if (plan?.ausgangslage?.anzahlElternteile === 2) {
    fillCheckboxes({
      elternteil: Elternteil.Zwei,
      geburtsdatum: informationForPdfAntrag.geburtsdatum,
      form,
      plan,
    });

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

  return await pdfDoc.save();
}

export async function preparePlanungsseite({
  informationForPdfAntrag,
  plan,
}: {
  informationForPdfAntrag: InformationForPdfAntrag;
  plan: PlanMitBeliebigenElternteilen | undefined;
}) {
  const pdfDoc = await getPdfDocument({
    completeForm: false,
    geburtsdatum: informationForPdfAntrag.geburtsdatum,
  });
  const form = pdfDoc.getForm();

  fillCheckboxes({
    elternteil: Elternteil.Eins,
    geburtsdatum: informationForPdfAntrag.geburtsdatum,
    form,
    plan,
  });

  if (plan?.ausgangslage?.anzahlElternteile === 2) {
    fillCheckboxes({
      elternteil: Elternteil.Zwei,
      geburtsdatum: informationForPdfAntrag.geburtsdatum,
      form,
      plan,
    });

    // The single page has no textfields for the names of the parents.
    // The following writes the names on top of the page,
    // if both parents filled out the planer.
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

  return await pdfDoc.save();
}

async function getPdfDocument({
  completeForm,
  geburtsdatum,
}: {
  completeForm: boolean;
  geburtsdatum: Date;
}) {
  const pdfVersion = getPdfVersion(geburtsdatum);
  if (!pdfVersion) {
    throw Error("PDF Version not found");
  }

  const formUrl = completeForm
    ? pdfVersion.pdfFileAntragPath
    : pdfVersion.pdfFileSeitePath;

  const formPdfBytes = await fetch(formUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(formPdfBytes);

  return pdfDoc;
}

function fillCheckboxes({
  elternteil,
  geburtsdatum,
  form,
  plan,
}: {
  elternteil: Elternteil;
  geburtsdatum: Date;
  form: PDFForm;
  plan: PlanMitBeliebigenElternteilen | undefined;
}) {
  for (let i = 1; i < 33; i++) {
    const variante =
      plan?.lebensmonate[i as Lebensmonatszahl]?.[elternteil].gewaehlteOption;
    if (variante != undefined && variante != "kein Elterngeld") {
      form
        .getCheckBox(
          getFieldName({
            geburtsdatum,
            variante,
            elternteil: elternteil,
            lebensmonat: i as Lebensmonatszahl,
          }),
        )
        .check();
    }
  }
}
