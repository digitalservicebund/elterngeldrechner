import classNames from "classnames";
import { Path, useForm } from "react-hook-form";
import {
  Button,
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components";

type Props = {
  readonly className?: string;
  readonly ease?: number;
  readonly obstacle?: string;
  readonly onChangeEase: (ease: Ease) => void;
  readonly onChangeObstacle: (obstacle: Obstacle | null) => void;
  readonly onSubmit: () => void;
};

export function UserFeedbackForm({
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

  // Minimum ease value required to prompt for the biggest obstacle
  const lowerEaseBoundary = 2;

  const easeValue = form.watch("ease");
  const obstacleValue = form.watch("obstacle");

  const isDifficultExperience = (easeValue: number) =>
    easeValue > lowerEaseBoundary;
  const isEasyExperience = (easeValue: number) =>
    easeValue <= lowerEaseBoundary;

  const easyExperience = easeValue && isEasyExperience(easeValue);
  const difficultExperience = easeValue && isDifficultExperience(easeValue);

  const showSubmit = easyExperience || (difficultExperience && obstacleValue);
  const disabledSubmit = !showSubmit || form.formState.isSubmitted;

  function handleEaseChange() {
    onChangeEase(form.getValues("ease")!);

    if (isEasyExperience(form.getValues("ease")!)) {
      if (form.getValues("obstacle")) {
        onChangeObstacle(null);
      }
    }
  }

  function handleObstacleChange() {
    onChangeObstacle(form.getValues("obstacle")!);
  }

  const submitButton = (
    <Button
      id="feedback-submit-button"
      disabled={disabledSubmit}
      label="Feedback senden"
      className="mt-40"
      isSubmitButton
    />
  );

  return (
    <form
      className={classNames(className, "flex flex-col gap-8 print:hidden")}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="rounded bg-primary-light px-24 py-32">
        <CustomRadioGroup
          className="mx-16 mb-20 mt-16 max-w-[29rem]"
          legend={
            <b>Wie einfach war es für Sie den Elterngeldrechner zu nutzen?</b>
          }
          name={"ease" as Path<State>}
          options={easeOptions}
          register={form.register}
          registerOptions={{ onChange: handleEaseChange }}
          disabled={form.formState.isSubmitted}
          horizontal
        />

        {!!easyExperience && submitButton}
      </div>

      {!!difficultExperience && (
        <div className="rounded bg-primary-light px-24 py-32">
          <CustomRadioGroup
            legend={<b>Was war die größte Schwierigkeit?</b>}
            name={"obstacle" as Path<State>}
            register={form.register}
            options={obstacleOptions}
            registerOptions={{ onChange: handleObstacleChange }}
            disabled={form.formState.isSubmitted}
          />

          {submitButton}
        </div>
      )}

      {!!form.formState.isSubmitted && (
        <div className="rounded bg-primary-light px-24 py-32">
          <b>
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
      <span className="absolute mt-80 whitespace-nowrap" id={id}>
        {text}
      </span>
    );
  };
}

type Ease = 1 | 2 | 3 | 4 | 5;
