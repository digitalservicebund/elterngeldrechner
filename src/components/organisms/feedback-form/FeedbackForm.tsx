import { Path, useForm } from "react-hook-form";
import classNames from "classnames";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/components/molecules";
import { Button } from "@/components/atoms";

type Props = {
  readonly className?: string;
  readonly defaultValues: DefaultState;
  readonly onChangeEase: (ease: Ease) => void;
  readonly onChangeObstacle: (obstacle: Obstacle) => void;
  readonly onSubmit: () => void;
};

export function FeedbackForm({
  className,
  defaultValues,
  onChangeEase,
  onChangeObstacle,
  onSubmit,
}: Props) {
  const form = useForm<State>({
    defaultValues: {
      ease: defaultValues.ease as Ease,
      obstacle: defaultValues.obstacle as Obstacle,
    },
  });

  const easeValue = form.watch("ease");
  const obstacleValue = form.watch("obstacle");

  const formCompleted = easeValue && obstacleValue;
  const disabledSubmit = !formCompleted || form.formState.isSubmitted;

  function handleEaseChange() {
    onChangeEase(form.getValues("ease")!);
  }

  function handleObstacleChange() {
    onChangeObstacle(form.getValues("obstacle")!);
  }

  return (
    <form
      className={classNames(className, "flex flex-col gap-8")}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
        <strong className="block pb-16">
          Wie einfach war es für Sie den Elterngeldrechner zu nutzen?
        </strong>

        <div className="mx-16 mb-20 mt-16 max-w-[380px]">
          <CustomRadioGroup
            name={"ease" as Path<State>}
            options={easeOptions}
            register={form.register}
            errors={form.formState.errors}
            registerOptions={{ onChange: handleEaseChange }}
            disabled={form.formState.isSubmitted}
            horizontal
          />
        </div>
      </div>

      {easeValue ? (
        <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
          <strong className="block pb-16">
            Was war die größte Schwierigkeit?
          </strong>

          <CustomRadioGroup
            name={"obstacle" as Path<State>}
            register={form.register}
            options={obstacleOptions}
            errors={form.formState.errors}
            registerOptions={{ onChange: handleObstacleChange }}
            disabled={form.formState.isSubmitted}
          />
          <Button
            disabled={disabledSubmit}
            label="Feedback senden"
            className="mt-40"
            isSubmitButton
          />
        </div>
      ) : null}

      {form.formState.isSubmitted ? (
        <div className="rounded-[0.375rem] bg-primary-light px-24 py-32">
          <strong>
            Vielen Dank! Ihr Feedback hilft uns, den Elterngeldrechner für alle
            Nutzenden zu verbessern!
          </strong>
        </div>
      ) : null}
    </form>
  );
}

type State = { obstacle?: Obstacle; ease?: Ease };
export type DefaultState = { obstacle?: string; ease?: number };

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
  return (
    <span className="text-sm text-gray-600 absolute mt-[80px]">{text}</span>
  );
}

type Ease = 1 | 2 | 3 | 4 | 5;
