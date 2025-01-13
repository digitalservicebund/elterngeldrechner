import { Kind } from "@/globals/js/calculations/model";

/**
 * Sucht das zuletzt geborene Kind.
 *
 * Source: de.init.anton.plugins.egr.service.AbstractAlgorithmus.fktMax(...)
 *
 * @param kindList Eine Liste von {@link Kind}.
 * @return Das zuletzt geborene ({@link Kind}) oder undefined, wenn die Liste leer ist.
 */
export function findLastBornChild(kindList: Kind[]): Kind | undefined {
  if (kindList.length === 0) {
    return undefined;
  }

  // wenn nur ein Kind enthalten ist, dann brauchen wir nicht zu sortieren
  if (kindList.length === 1) {
    return kindList[0];
  }

  const cleanKindList = sortByGeburtsdatum(kindList);
  return cleanKindList[cleanKindList.length - 1];
}

/**
 * Sucht das zweite zuletzt geborene Kind.
 *
 * Source: de.init.anton.plugins.egr.service.AbstractAlgorithmus.fktZweitMax(...)
 *
 * @param kindList Eine Liste von {@link Kind}.
 * @return Das zweite zuletzt geborene ({@link Kind}) oder undefined, wenn die Liste leer ist oder nur ein Kind enthält.
 */
export function findSecondLastBornChild(kindList: Kind[]): Kind | undefined {
  if (kindList.length < 2) {
    return undefined;
  }

  const cleanKindList = sortByGeburtsdatum(kindList);
  return cleanKindList[cleanKindList.length - 2];
}

const sortByGeburtsdatum = (kindList: Kind[]) => {
  return kindList.sort((a, b) => {
    return a.geburtsdatum?.valueOf() - b.geburtsdatum?.valueOf();
  });
};
