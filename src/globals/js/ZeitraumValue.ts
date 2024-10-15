export type ZeitraumValueType = "Date" | "Integer";

export const zeitraumValueOf = (
  value: string,
  type: ZeitraumValueType,
): number => {
  if (isDateType(type)) {
    return new Date(value).getTime();
  } else if (isIntegerType(type)) {
    return Number.parseInt(value);
  }

  throw new Error("Unknown ZeitraumValueType");
};

function isDateType(type: ZeitraumValueType): type is "Date" {
  return type === "Date";
}

function isIntegerType(type: ZeitraumValueType): type is "Integer" {
  return type === "Integer";
}
