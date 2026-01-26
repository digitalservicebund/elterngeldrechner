import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  type AllgemeineAngaben,
  AllgemeineAngabenSchema,
  bundeslaender,
} from "./AllgemeineAngaben.schema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/common";

export function AllgemeineAngaben() {
  const formIdentifier = useId();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(AllgemeineAngabenSchema),
  });
  const { errors: formErrors } = formState;

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (name) => ({ value: name, label: name }),
  );

  return (
    <>
      <h2>Allgemeine Angaben</h2>
      <form
        id={formIdentifier}
        className="flex flex-col gap-56"
        onSubmit={handleSubmit(() => void navigate("/abfrageteil-v2/kind"))}
      >
        <CustomSelect
          autoWidth
          label="In welchem Bundesland planen Sie Elterngeld zu beantragen?"
          errors={formErrors}
          register={register}
          options={bundeslandOptions}
          {...register("bundesland")}
        />

        <CustomRadioGroup
          legend="Hatten Sie im Kalenderjahr vor der Geburt ein Gesammteinkommen von mehr als 175.000 Euro?"
          errors={formErrors}
          register={register}
          options={[
            { value: "true", label: "Ja" },
            { value: "false", label: "Nein" },
          ]}
          {...register("gesamteinkommenGrenzeUeberschritten")}
          slotBetweenLegendAndOptions={
            <InfoText
              question="Was bedeutet Gesamteinkommen?"
              answer="Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 175.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen."
            ></InfoText>
          }
        />

        <Button type="submit" buttonStyle="primary" form={formIdentifier}>
          Verstanden und weiter
        </Button>
      </form>
    </>
  );
}
