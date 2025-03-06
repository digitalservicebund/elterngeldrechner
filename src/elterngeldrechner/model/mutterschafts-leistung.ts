export enum MutterschaftsLeistung {
  MUTTERSCHAFTS_LEISTUNG_NEIN = "MUTTERSCHAFTS_LEISTUNG_NEIN",
  MUTTERSCHAFTS_LEISTUNG_8_WOCHEN = "MUTTERSCHAFTS_LEISTUNG_8_WOCHEN",
  MUTTERSCHAFTS_LEISTUNG_12_WOCHEN = "MUTTERSCHAFTS_LEISTUNG_12_WOCHEN",
}

function mutterschaftsLeistungInWochen(
  mutterschaftsLeistung: MutterschaftsLeistung,
) {
  switch (mutterschaftsLeistung) {
    case MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN:
      return 0;
    case MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_8_WOCHEN:
      return 8;
    case MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_12_WOCHEN:
      return 12;
  }
}

export function mutterschaftsLeistungInMonaten(
  mutterschaftsLeistung: MutterschaftsLeistung,
) {
  return mutterschaftsLeistungInWochen(mutterschaftsLeistung) / 4;
}
