import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  ElternteilAusklammerungZeiten,
  ElternteilAusklammerungZeitenSchema,
} from "./ElternteilSchema";
import { Button } from "@/application/components";
import { DateInput } from "@/application/features/abfrageteil-next/components/DateInput";
import { Page } from "@/application/features/abfrageteil-next/components/Page";
import { useEventContext } from "@/application/features/abfrageteil-next/events/EventContext";
import { useElternteilIndex } from "@/application/features/abfrageteil-next/hooks/usePageIndex";
import {
  type FormEvent,
  Route,
  findeNaechstenPfad,
} from "@/application/features/abfrageteil-next/routing";
import { encodeSafely } from "@/application/features/abfrageteil-next/zod";

export function ElternteilAusklammerungZeitenPage() {
  const { dispatch, findeLetztesGueltigesEvent, findeVorherigenPfad } =
    useEventContext();

  const formIdentifier = useId();
  const navigate = useNavigate();

  const currentRoute = Route.ElternteilAusklammerungZeitenAngaben;
  const elternteilIndex = useElternteilIndex();
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(currentRoute, {
    elternteilIndex,
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(ElternteilAusklammerungZeitenSchema),
    defaultValues: encodeSafely(
      ElternteilAusklammerungZeitenSchema,
      letztesGueltigesEvent,
    ),
  });

  const { errors: formErrors } = formState;

  const onSubmit = (values: ElternteilAusklammerungZeiten) => {
    const event: FormEvent = {
      route: currentRoute,
      payload: values,
      params: { elternteilIndex },
    };

    dispatch(event);

    void navigate(findeNaechstenPfad(event));
  };

  const navigateBack = () => {
    void navigate(findeVorherigenPfad(currentRoute, { elternteilIndex }));
  };

  return (
    <Page heading="Finanzielle Situation">
      <form
        id={formIdentifier}
        className="mt-40 flex flex-col gap-56"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3>Bitte machen Sie Detailangaben</h3>

        <div>
          <h5>
            Von wann bis wann waren Sie für ein älteres Kind im Mutterschutz?
          </h5>

          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-von"
              >
                Beginn des Mutterschutzes (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-von"
                {...register}
                error={formErrors[0]?.von?.message}
                name=""
              />
            </div>
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-bis"
              >
                Ende des Mutterschutzes (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-bis"
                {...register}
                error={formErrors[0]?.bis?.message}
                name=""
              />
            </div>
          </div>
        </div>

        <div>
          <h5>
            Von wann bis wann haben Sie Elterngeld für ein älteres Kind (maximal
            14 Monate alt) bekommen?
          </h5>

          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-von"
              >
                Beginn (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-von"
                {...register}
                error={formErrors[0]?.von?.message}
                name=""
              />
            </div>
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-bis"
              >
                Ende (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-bis"
                {...register}
                error={formErrors[0]?.bis?.message}
                name=""
              />
            </div>
          </div>
        </div>

        <div>
          <h5>
            Von wann bis wann waren Sie wegen Ihrer Schwangerschaft krank?
          </h5>

          <div className="flex flex-wrap gap-56 *:grow *:basis-[22rem]">
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-von"
              >
                Beginn (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-von"
                {...register}
                error={formErrors[0]?.von?.message}
                name=""
              />
            </div>
            <div>
              <label
                className="mb-4 mt-20 block text-16"
                htmlFor="ausklammerungenMutterschutzAnderesKind-bis"
              >
                Ende (TT.MM.JJJJ)
              </label>

              <DateInput
                id="ausklammerungenMutterschutzAnderesKind-bis"
                {...register}
                error={formErrors[0]?.bis?.message}
                name=""
              />
            </div>
          </div>
        </div>

        <div className="flex gap-16">
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
