export function compose<IO>(
  ...functions: ComposeFunction<IO>[]
): ComposeFunction<IO> {
  return function (input: IO) {
    return functions.reduce(
      (input, nextFunction) => nextFunction(input),
      input,
    );
  };
}

type ComposeFunction<InputOutput> = (input: InputOutput) => InputOutput;
