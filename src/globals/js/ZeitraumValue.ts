export namespace ZeitraumValue {
  export type Type = "Date" | "Integer";

  export const valueOf = (value: string, type: Type): number => {
    switch (type) {
      case "Date":
        return new Date(value).getTime();
      case "Integer":
        return Number.parseInt(value);
    }
    throw new Error("Unknown ZeitraumValueType");
  };
}
