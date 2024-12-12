export function aufDenEuroAufrunden(betrag: number): number {
  return Math.ceil(betrag);
}

export function aufDenEuroAbrunden(betrag: number): number {
  return Math.floor(betrag);
}

export function aufDenCentAbrunden(betrag: number): number {
  return Math.floor(betrag * 100) / 100;
}
