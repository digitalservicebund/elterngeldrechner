import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  AllgemeineAngaben,
  AllgemeineAngabenSchema,
  bundeslaender,
} from "./AllgemeineAngaben.schema";
import { Button, CustomRadioGroup, InfoText } from "@/application/components";
import { PageV2 } from "@/application/components/PageV2";
import {
  CustomSelect,
  SelectOption,
} from "@/application/features/abfrageteil/components/common";
import { useEventContext } from "@/application/routing-next/EventContext";
import { Route, getNextRoute } from "@/application/routing-next/Router";

export function AllgemeineAngabenPage() {
  const { dispatch, findLastEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const lastEvent = findLastEvent(Route.AllgemeineAngaben);

  const defaultValues = lastEvent
    ? AllgemeineAngabenSchema.encode(lastEvent)
    : undefined;

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(AllgemeineAngabenSchema),
    defaultValues: defaultValues,
  });

  const { errors: formErrors } = formState;

  const bundeslandOptions: SelectOption<string>[] = bundeslaender.map(
    (name) => ({ value: name, label: name }),
  );

  const onSubmit = (values: AllgemeineAngaben) => {
    dispatch({
      route: Route.AllgemeineAngaben,
      payload: values,
    });

    const nextPath = getNextRoute({
      route: Route.AllgemeineAngaben,
      payload: values,
    });

    void navigate(`/abfrageteil-v2${nextPath}`);
  };

  return (
    <PageV2
      heading="Allgemeine Angaben"
      navigationItems={[]}
      currentNavigationItem=""
    >
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h3 className="mb-10">
            In welchem Bundesland wollen Sie Elterngeld beantragen?
          </h3>

          <CustomSelect
            autoWidth
            label="Bundesland"
            errors={formErrors}
            register={register}
            options={bundeslandOptions}
            {...register("bundesland")}
          />
        </div>

        <div>
          <h3 className="mb-10">
            Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von
            mehr als 175.000 Euro?
          </h3>

          <CustomRadioGroup
            legend=""
            errors={formErrors}
            register={register}
            options={[
              { value: "yes", label: "Ja" },
              { value: "no", label: "Nein" },
            ]}
            name="gesamteinkommenGrenzeUeberschritten"
            slotBetweenLegendAndOptions={
              <InfoText
                question="Was bedeutet Gesamteinkommen?"
                answer="Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Elterngeld ist ausgeschlossen ab einem zu versteuernden Jahreseinkommen von mehr als 175.000 Euro bei Alleinerziehenden, Paaren und getrennt Erziehenden. Diese Angabe finden Sie beispielsweise auf Ihrem Steuerbescheid. Wenn Sie Ihr Kind alleine erziehen, geben Sie nur Ihr eigenes Einkommen an. Als Paar oder getrennt erziehende Eltern rechnen Sie das Einkommen beider Elternteile zusammen."
              ></InfoText>
            }
          />
        </div>

        <div className="flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={() => {}}>
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </form>
    </PageV2>
  );
}
