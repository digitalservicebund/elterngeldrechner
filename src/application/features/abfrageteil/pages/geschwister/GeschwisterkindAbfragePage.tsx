import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useNavigateBack } from "@/application/features/abfrageteil/hooks/useNavigateBack";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAbfrageSchema,
} from "./GeschwisterSchema";
import { Button, InfoText } from "@/application/features/components";
import { CustomRadioGroup } from "@/application/features/components/CustomRadioGroup";
import { Page } from "@/application/features/components/Page";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/routing";
import { encodeSafely } from "@/application/features/abfrageteil/zod";
import { useValidierungsfehlerTracking } from "@/application/features/abfrageteil/hooks/useValidierungsfehlerTracking";
import { posthog } from "@/application/user-tracking";

export function GeschwisterkindAbfragePage() {
  const { dispatch, findeLetztesGueltigesEvent } = useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.GeschwisterkindAbfrage;
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute);

  const { register, handleSubmit, formState, subscribe } = useForm({
    resolver: zodResolver(GeschwisterkindAbfrageSchema),
    defaultValues: encodeSafely(
      GeschwisterkindAbfrageSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  useValidierungsfehlerTracking(subscribe);

  const onSubmit = async (values: GeschwisterkindAbfrage) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
    };

    dispatch(event);

    posthog.register({
      // Reset the accumulated flag so re-answering the question starts a fresh
      // count; GeschwisterkindAngabenPage re-accumulates it per sibling.
      hat_geschwister: values.istVorhanden,
    });

    await navigate(findeNaechstenPfad(event));
  };

  const navigateBack = useNavigateBack(currentRoute);

  return (
    <Page id="geschwister-page" heading="Angaben zu Geschwistern">
      <form
        id={formIdentifier}
        className="flex flex-col gap-40"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <CustomRadioGroup
          legend=<h3 className="mb-10">
            Leben bereits ältere Geschwisterkinder in Ihrem Haushalt?
          </h3>
          errors={formErrors}
          register={register}
          name="istVorhanden"
          options={[
            { value: "yes", label: "Ja" },
            { value: "no", label: "Nein" },
          ]}
        >
          <InfoText
            question="Wann kann ich einen Geschwisterbonus erhalten?"
            answer={
              <>
                <p>
                  Wenn schon ein oder mehrere ältere Kinder in Ihrem Haushalt
                  leben, können Sie mehr Geld bekommen. Das nennt man
                  Geschwisterbonus.
                </p>
                <p className="mb-0">
                  Den Geschwisterbonus bekommen Sie, wenn in Ihrem Haushalt
                </p>
                <ul>
                  <li>
                    mindestens <strong>ein weiteres Kind unter 3 Jahren</strong>{" "}
                    lebt oder
                  </li>
                  <li>
                    mindestens <strong>2 weitere Kinder unter 6 Jahren</strong>{" "}
                    leben oder
                  </li>
                  <li>
                    mindestens{" "}
                    <strong>
                      ein weiteres Kind mit Behinderung unter 14 Jahren
                    </strong>{" "}
                    lebt.
                  </li>
                </ul>

                <p className="mt-20 font-bold">Wie viel Geld ist das?</p>
                <ul>
                  <li>Ihr Elterngeld wird um 10 Prozent erhöht.</li>
                  <li>Sie bekommen aber mindestens:</li>
                </ul>
                <ul className="pl-32">
                  <li>75 € mehr im Monat beim Basis-Elterngeld</li>
                  <li>37,50 € mehr im Monat beim ElterngeldPlus</li>
                  <li>
                    Sie bekommen den Geschwisterbonus, bis das ältere Kind die
                    Alters-Grenze erreicht hat.
                  </li>
                </ul>

                <p className="mt-20 font-bold">Haushaltszugehörigkeit:</p>
                <p>
                  Damit der Partner oder die Partnerin Elterngeld beziehen kann,
                  muss das Kind im gemeinsamen Haushalt angemeldet sein. In der
                  Patchwork-Familie zählen hierzu auch die leiblichen Kinder des
                  Partners/der Partnerin, sofern diese mit im gemeinsamen
                  Haushalt leben.
                </p>

                <p className="mb-0 mt-20 font-bold">
                  Besonderheit bei Adoption:
                </p>
                <p>
                  Bei Adoptiv-Kindern zählt nicht der Geburtstag, sondern der
                  Tag, an dem das Kind bei Ihnen eingezogen ist. Ab diesem Tag
                  gilt das Kind für die nächsten 3 Jahre als „unter 3“ (bzw. für
                  6 Jahre als „unter 6“), solange es bei Einzug noch keine 14
                  Jahre alt war.
                </p>
              </>
            }
          />
        </CustomRadioGroup>

        <div className="mt-40 flex gap-16">
          <Button type="button" buttonStyle="secondary" onClick={navigateBack}>
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </form>
    </Page>
  );
}
