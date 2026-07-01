export const mappeAusklammerungGrund = (
  grund: string,
  geburtsdatumGeschwisterkind?: string,
) => {
  const texte: Record<string, string> = {
    mutterschutz: "Mutterschutz für dieses Kind",
    mutterschutzGeschwisterkind: `Mutterschutz für Geschwisterkind ${geburtsdatumGeschwisterkind ? `(geb. ${geburtsdatumGeschwisterkind})` : ""}`,
    elterngeldGeschwisterkind: `Elterngeld für Geschwisterkind ${geburtsdatumGeschwisterkind ? `(geb. ${geburtsdatumGeschwisterkind})` : ""}`,
    erkrankungSchwangerschaft: "Krankheit wegen der Schwangerschaft",
  };

  return texte[grund] || grund;
};
