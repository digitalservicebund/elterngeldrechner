import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { GeborenesKindSchema } from "./Kind.schema";
import { Button } from "@/application/components";
import { CustomDate } from "@/application/features/abfrageteil/components/NachwuchsForm/CustomDate";

// TODO: Find a better way to handle conversion of dates and booleans!

export function GeborenesKind() {
  const formIdentifier = useId();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeborenesKindSchema),
  });
  const { errors } = formState;

  const navigateNextPage = () => {
    // TODO: Decision tree
  };

  const entbindungsterminInputIdentifier = useId();

  return (
    <>
      <h2>Angaben zum Kind</h2>
      <form
        id={formIdentifier}
        className="flex flex-col gap-56"
        onSubmit={handleSubmit(navigateNextPage)}
        noValidate
      >
        <h3>Herzlichen Glückwunsch!</h3>
        <h3>
          Welcher errechnete Entbindungstermin wird im Mutterpass angegeben?
        </h3>

        <label
          className="block text-16"
          htmlFor={entbindungsterminInputIdentifier}
        >
          Errechneter Entbindungstermin (TT.MM.JJJJ)
        </label>

        <CustomDate
          id={entbindungsterminInputIdentifier}
          error={errors.errechneterEntbindungstermin?.message}
          {...register("errechneterEntbindungstermin")}
        />

        <Button type="submit" buttonStyle="primary" form={formIdentifier}>
          Weiter
        </Button>
      </form>
    </>
  );
}
