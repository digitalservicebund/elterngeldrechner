import type { z } from "zod";

export function encodeSafely<Output, Input>(
  schema: z.ZodType<Output, Input>,
  value: Output | undefined,
): Input | undefined {
  return value ? schema.encode(value) : undefined;
}
