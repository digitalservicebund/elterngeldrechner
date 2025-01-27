export enum SteuerKlasse {
  SKL1 = "1",
  SKL2 = "2",
  SKL3 = "3",
  SKL4 = "4",
  SKL4_FAKTOR = "4 mit Faktor",
  SKL5 = "5",
  SKL6 = "6",
}

export function steuerklasseToNumber(steuerKlasse: SteuerKlasse) {
  switch (steuerKlasse) {
    case SteuerKlasse.SKL1:
      return 1;
    case SteuerKlasse.SKL2:
      return 2;
    case SteuerKlasse.SKL3:
      return 3;
    case SteuerKlasse.SKL4:
    case SteuerKlasse.SKL4_FAKTOR:
      return 4;
    case SteuerKlasse.SKL5:
      return 5;
    case SteuerKlasse.SKL6:
      return 6;
  }
}

export function steuerklasseOfNumber(steuerKlasse: number) {
  switch (steuerKlasse) {
    case 1:
      return SteuerKlasse.SKL1;
    case 2:
      return SteuerKlasse.SKL2;
    case 3:
      return SteuerKlasse.SKL3;
    case 4:
      return SteuerKlasse.SKL4;
    case 5:
      return SteuerKlasse.SKL5;
    case 6:
      return SteuerKlasse.SKL6;
    default:
      throw new Error(`Unknown Steuerklasse: '${steuerKlasse}'`);
  }
}
