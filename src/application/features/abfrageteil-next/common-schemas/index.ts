import { Temporal } from "@js-temporal/polyfill";
import * as z from "zod";

const GermanDateinputSchema = z
  .string()
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    error: "Bitte geben Sie ein gültiges Datum im Format TT.MM.JJJJ ein",
  })
  .transform((value) => value.split("."))
  .transform(([day, month, year]) =>
    Temporal.PlainDate.from(`${year}-${month}-${day}`),
  );

const BooleanRadiobuttonSchema = z
  .enum(["yes", "no"], {
    error: "Wählen Sie bitte Ja oder Nein",
  })
  .transform((arg) => arg === "yes");

export { BooleanRadiobuttonSchema, GermanDateinputSchema };
