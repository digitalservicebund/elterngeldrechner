import { Path, useForm } from "react-hook-form";
import classNames from "classnames";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/components/molecules";
import { Button } from "@/components/atoms";

type Props = {
  readonly className?: string;
  readonly ease?: number;
  readonly obstacle?: string;
  readonly onChangeEase: (ease: Ease) => void;
  readonly onChangeObstacle: (active: string, inactive: string[]) => void;
  readonly onSubmit: () => void;
};

export function FeedbackForm({
  className,
  obstacle,
  ease,
  onChangeEase,
  onChangeObstacle,
  onSubmit,
}: Props) {
  const form = useForm<State>({
    defaultValues: { ease: ease as Ease, obstacle: obstacle as Obstacle },
  });

  const easeValue = form.watch("ease");
  const obstacleValue = form.watch("obstacle");

  const formCompleted = easeValue && obstacleValue;
  const disabledSubmit = !formCompleted || form.formState.isSubmitted;

  function handleEaseChange() {
    onChangeEase(form.getValues("ease")!);
  }

  function handleObstacleChange() {
    const active = form.getValues("obstacle")!;
    const inactives = obstacles.filter((it) => it !== active);

    onChangeObstacle(active, inactives);
  }

  const easeFormTransformerFunc = (it: Ease) => String(it);

  return (
    <form
      className={classNames(className, "flex flex-col gap-8")}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
        <b className="block pb-16" data-testid="ease-feedback-question">
          Wie einfach war es für Sie den Elterngeldrechner zu nutzen?
        </b>

        <div className="mx-16 mb-20 mt-16 max-w-[380px]">
          <CustomRadioGroup
            name={"ease" as Path<State>}
            options={easeOptions}
            register={form.register}
            errors={form.formState.errors}
            registerOptions={{
              onChange: handleEaseChange,
              setValueAs: easeFormTransformerFunc,
            }}
            disabled={form.formState.isSubmitted}
            horizontal
          />
        </div>
      </div>

      {!!easeValue && easeValue > 0 && (
        <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
          <b className="block pb-16">Was war die größte Schwierigkeit?</b>

          <CustomRadioGroup
            name={"obstacle" as Path<State>}
            register={form.register}
            options={obstacleOptions}
            errors={form.formState.errors}
            registerOptions={{ onChange: handleObstacleChange }}
            disabled={form.formState.isSubmitted}
          />

          <Button
            id="feedback-submit-button"
            disabled={disabledSubmit}
            label="Feedback senden"
            className="mt-40"
            isSubmitButton
          />
        </div>
      )}

      {!!form.formState.isSubmitted && (
        <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
          <b data-testid="feedback-appreciation">
            Vielen Dank! Ihr Feedback hilft uns, den Elterngeldrechner für alle
            Nutzenden zu verbessern!
          </b>
        </div>
      )}
    </form>
  );
}

type State = { obstacle?: Obstacle; ease?: Ease };

type Obstacle = (typeof obstacles)[number];

const obstacles = [
  "Informationen verstehen",
  "Informationen finden",
  "Angaben machen",
  "Planer bedienen",
] as const;

const obstacleOptions: CustomRadioGroupOption<Obstacle>[] = obstacles.map(
  (label) => ({ value: label, label: label }),
);

const easeOptions: CustomRadioGroupOption<number>[] = [
  { value: 1, label: "1", description: descriptionContainer("sehr einfach") },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5", description: descriptionContainer("sehr schwer") },
];

function descriptionContainer(text: string) {
  return function accessibleDescriptionContainer(id: string) {
    return (
      <span className="absolute mt-80" id={id}>
        {text}
      </span>
    );
  };
}

type Ease = 1 | 2 | 3 | 4 | 5;
