import fs from "fs/promises";
import { PDFDocument } from "@cantoo/pdf-lib";
import { Locator, Page } from "@playwright/test";
import { POMOpts } from "./types";

interface PdfTextfieldValues {
  anzahlKinder: string;
  geburtsdatum: string;
  nameET1: string;
  nameET2: string;
}

interface PdfCheckboxValues {
  basis1: Array<boolean>;
  plus1: Array<boolean>;
  bonus1: Array<boolean>;
  basis2: Array<boolean>;
  plus2: Array<boolean>;
  bonus2: Array<boolean>;
}

export class DatenuebernahmeAntragPOM {
  readonly page: Page;
  readonly opts?: POMOpts;

  readonly heading: Locator;

  constructor(page: Page, opts?: POMOpts) {
    this.page = page;
    this.opts = opts;

    this.heading = page.getByRole("heading", {
      name: "Übernahme Planung in den PDF Antrag auf Elterngeld",
    });
  }

  async downloadCompleteForm() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.page
        .getByRole("button", {
          name: "Antrag_auf_Elterngeld.pdf",
        })
        .click(),
    ]);

    const pdfBuffer = await download.createReadStream().then(async (stream) => {
      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    });

    const pdfArrayBuffer = new Uint8Array(pdfBuffer);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    const pdfTextValues = getTextValues(pdfDoc);
    const pdfCheckboxValues = getCheckboxValues(pdfDoc);

    return [pdfTextValues, pdfCheckboxValues];
  }

  async downloadSinglePage() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.page
        .getByRole("button", {
          name: "Seite_Planung_Elterngeld.pdf",
        })
        .click(),
    ]);

    const pdfBuffer = await download.createReadStream().then(async (stream) => {
      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    });

    const pdfArrayBuffer = new Uint8Array(pdfBuffer);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    return getCheckboxValues(pdfDoc);
  }

  async getReferencePdfAntrag(singleParent: boolean) {
    const filePath = singleParent
      ? "tests/assets/antrag_alleine.pdf"
      : "tests/assets/antrag.pdf";
    const pdfBuffer = await fs.readFile(filePath);
    const pdfArrayBuffer = new Uint8Array(pdfBuffer);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    const pdfTextValues = getTextValues(pdfDoc);
    const pdfCheckboxValues = getCheckboxValues(pdfDoc);

    return [pdfTextValues, pdfCheckboxValues];
  }

  async getReferencePdfSeite(singleParent: boolean) {
    const filePath = singleParent
      ? "tests/assets/seite_alleine.pdf"
      : "tests/assets/seite.pdf";
    const pdfBuffer = await fs.readFile(filePath);
    const pdfArrayBuffer = new Uint8Array(pdfBuffer);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    return getCheckboxValues(pdfDoc);
  }

  async back() {
    await this.page
      .getByRole("button", { name: "Zurück", exact: true })
      .click();
  }
}

function getTextValues(pdf: PDFDocument) {
  const form = pdf.getForm();

  const pdfTextfieldValues: PdfTextfieldValues = {
    anzahlKinder: "",
    geburtsdatum: "",
    nameET1: "",
    nameET2: "",
  };

  const anzahlKinder = form.getTextField("1a Anzahl der Kinder");
  pdfTextfieldValues.anzahlKinder = anzahlKinder.getText() ?? "";

  const geburtsdatum = form.getTextField("1b Geburtsdatum Jahr");
  pdfTextfieldValues.geburtsdatum = geburtsdatum.getText() ?? "";

  const nameET1 = form.getTextField("2b Vorname(n) AS");
  pdfTextfieldValues.nameET1 = nameET1.getText() ?? "";

  const nameET2 = form.getTextField("2b Vorname(n) 2E");
  pdfTextfieldValues.nameET2 = nameET2.getText() ?? "";

  return pdfTextfieldValues;
}

function getCheckboxValues(pdf: PDFDocument) {
  const form = pdf.getForm();

  const pdfCheckboxValues: PdfCheckboxValues = {
    basis1: [],
    plus1: [],
    bonus1: [],
    basis2: [],
    plus2: [],
    bonus2: [],
  };

  for (let i = 1; i < 19; i++) {
    const basis1 = form.getCheckBox(`10 Basiselterngeld AS Monat ${i}`);
    pdfCheckboxValues.basis1.push(basis1.isChecked());

    const basis2 = form.getCheckBox(`10 Basiselterngeld 2E Monat ${i}`);
    pdfCheckboxValues.basis2.push(basis2.isChecked());
  }

  for (let i = 1; i < 33; i++) {
    const plus1 = form.getCheckBox(`10 Elterngeld Plus AS Monat ${i}`);
    pdfCheckboxValues.plus1.push(plus1.isChecked());

    const plus2 = form.getCheckBox(`10 Elterngeld Plus 2E Monat ${i}`);
    pdfCheckboxValues.plus2.push(plus2.isChecked());

    const bonus1 = form.getCheckBox(`10 P-Bonus AS Monat ${i}`);
    pdfCheckboxValues.bonus1.push(bonus1.isChecked());

    const bonus2 = form.getCheckBox(`10 P-Bonus AS Monat ${i}`);
    pdfCheckboxValues.bonus2.push(bonus2.isChecked());
  }

  return pdfCheckboxValues;
}
