/**
 * Representation of the general concept of a successful or failed execution.
 * Therefore, it can either represent the state of an okay result with some
 * "return" value. Or the error result with some kind of error data.
 *
 * It's a purposeful implementation of the either-or and monads of functional
 * programming. The general naming and interface is inspired by other well known
 * implementations like in the Rust programming language.
 * Access to the result is granted with methods which somewhat enforce the
 * inspection of possible error results. So it harder to just implement the
 * happy-path in an imperative manner.
 * Further methods will be added with further use-cases.
 */
export class Result<Value, Error> {
  private constructor(private options: ResultOptions<Value, Error>) {}

  static ok<Value>(value: Value): Result<Value, never> {
    return new Result({ isOk: true, value });
  }

  static error<Error>(error: Error): Result<never, Error> {
    return new Result({ isOk: false, error });
  }

  unwrapOrElse(orElse: (error: Error) => Value): Value {
    return this.options.isOk ? this.options.value : orElse(this.options.error);
  }

  mapOrElse<Output, MapOutput extends Output, OrElseOutput extends Output>(
    map: (value: Value) => MapOutput,
    orElse: (error: Error) => OrElseOutput,
  ): Output {
    return this.options.isOk
      ? map(this.options.value)
      : orElse(this.options.error);
  }
}

type ResultOptions<Value, Error> =
  | { isOk: true; value: Value; error?: never }
  | { isOk: false; value?: never; error: Error };

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("can use the ok instance", () => {
    const result = Result.ok("test value");

    const value = result.unwrapOrElse(() => "error");

    expect(value).toBe("test value");
  });

  it("can use the error instance", () => {
    const result: Result<string, string> = Result.error("test error");

    const error = result.unwrapOrElse((error) => error);

    expect(error).toBe("test error");
  });

  it("can follow up on  ok or errors instance with mapping", () => {
    const result = Result.ok(0);

    const followUpValue: string = result.mapOrElse(
      (value) => `Was ok: ${value}`,
      (error) => `Was error: ${error}`,
    );

    expect(followUpValue).toBe("Was ok: 0");
  });
}
