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
    await download.saveAs("test-results/test_antrag.pdf");

    const pdfBuffer = await fs.readFile("test-results/test_antrag.pdf");
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
          name: "Seite18_Antrag_Elterngeld.pdf",
        })
        .click(),
    ]);
    await download.saveAs("test-results/test_seite.pdf");

    const pdfBuffer = await fs.readFile("test-results/test_seite.pdf");
    const pdfArrayBuffer = new Uint8Array(pdfBuffer);
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    const pdfCheckboxValues = getCheckboxValues(pdfDoc);

    return pdfCheckboxValues;
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

    const pdfCheckboxValues = getCheckboxValues(pdfDoc);

    return pdfCheckboxValues;
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
    const isBasis1Checked = basis1.isChecked();
    pdfCheckboxValues.basis1.push(isBasis1Checked);

    const basis2 = form.getCheckBox(`10 Basiselterngeld 2E Monat ${i}`);
    const isBasis2Checked = basis2.isChecked();
    pdfCheckboxValues.basis2.push(isBasis2Checked);
  }

  for (let i = 1; i < 33; i++) {
    const plus1 = form.getCheckBox(`10 Elterngeld Plus AS Monat ${i}`);
    const isPlus1Checked = plus1.isChecked();
    pdfCheckboxValues.plus1.push(isPlus1Checked);

    const plus2 = form.getCheckBox(`10 Elterngeld Plus 2E Monat ${i}`);
    const isPlus2Checked = plus2.isChecked();
    pdfCheckboxValues.plus2.push(isPlus2Checked);

    const bonus1 = form.getCheckBox(`10 P-Bonus AS Monat ${i}`);
    const isBonus1Checked = bonus1.isChecked();
    pdfCheckboxValues.bonus1.push(isBonus1Checked);

    const bonus2 = form.getCheckBox(`10 P-Bonus AS Monat ${i}`);
    const isBonus2Checked = bonus2.isChecked();
    pdfCheckboxValues.bonus2.push(isBonus2Checked);
  }

  return pdfCheckboxValues;
}
