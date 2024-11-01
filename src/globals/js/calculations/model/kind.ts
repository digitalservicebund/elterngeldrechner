/**
 * Klasse repräsentiert ein Kind-Objekt.
 */
export interface Kind {
  /**
   * Gibt die Nummer des Kindes der Eltern an.
   *
   * entfernen, falls  nicht benötigt
   */
  nummer: number;
  geburtsdatum: Date | undefined;
  istBehindert: boolean;
}
