export const mappeAusklammerungGrund = (grund: string) => {
  const texte: Record<string, string> = {
    mutterschutz: "Mutterschutz für dieses Kind",
    mutterschutzGeschwisterkind: "Mutterschutz für ein älteres Kind",
    elterngeldGeschwisterkind: "Elterngeld für ein älteres Kind",
    erkrankungSchwangerschaft: "Krankheit wegen der Schwangerschaft",
  };

  return texte[grund] || grund;
};
