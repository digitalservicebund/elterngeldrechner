import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { GeburtSchema } from "./KindSchema";
import { Button, CustomRadioGroup } from "@/application/components";

export function KindPage() {
  const formIdentifier = useId();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(GeburtSchema),
  });
  const { errors } = formState;

  const navigateNextPage = () => {
    void navigate("/abfrageteil-next/kind/geboren");
  };

  return (
    <>
      <h2>Angaben zum Kind</h2>
      <form
        id={formIdentifier}
        className="flex flex-col gap-56"
        onSubmit={handleSubmit(navigateNextPage)}
      >
        <CustomRadioGroup
          legend="Ist Ihr Kind schon geboren?"
          errors={errors}
          register={register}
          name="istGeboren"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        />

        <Button type="submit" buttonStyle="primary" form={formIdentifier}>
          Weiter
        </Button>
      </form>
    </>
  );
}
