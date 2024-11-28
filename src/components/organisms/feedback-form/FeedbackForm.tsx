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

const obstacles = [
  "Informationen verstehen",
  "Informationen finden",
  "Angaben machen",
  "Planer bedienen",
] as const;

type Obstacle = (typeof obstacles)[number];
type Ease = 1 | 2 | 3 | 4 | 5;

type State = { obstacle?: Obstacle; ease?: Ease };
export type DefaultState = { obstacle?: string; ease?: number };

const obstacleOptions: CustomRadioGroupOption<Obstacle>[] = obstacles.map(
  (label) => ({ value: label, label }),
);

const easeOptions: CustomRadioGroupOption<number>[] = [1, 2, 3, 4, 5].map(
  (value) => ({ value, label: String(value) }),
);

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
        <div className="flex justify-center gap-32 pt-20">
          <span>sehr schwer</span>
          <CustomRadioGroup
            name={"ease" as Path<State>}
            options={easeOptions}
            register={form.register}
            errors={form.formState.errors}
            registerOptions={{ onChange: handleEaseChange }}
            horizontal
          />
          <span>sehr einfach</span>
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
