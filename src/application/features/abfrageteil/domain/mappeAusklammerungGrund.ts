export const mappeAusklammerungGrund = (
  grund: string,
  vornameGeschwisterkind?: string,
) => {
  const texte: Record<string, string> = {
    mutterschutz: "Mutterschutz für dieses Kind",
    mutterschutzGeschwisterkind: `Mutterschutz für ${vornameGeschwisterkind ?? "Geschwisterkind"}`,
    elterngeldGeschwisterkind: `Elterngeld für ${vornameGeschwisterkind ?? "Geschwisterkind"}`,
    erkrankungSchwangerschaft: "Krankheit wegen der Schwangerschaft",
  };

  return texte[grund] || grund;
};
