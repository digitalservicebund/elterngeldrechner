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
      className="mt-40"
      type="submit"
      disabled={disabledSubmit}
    >
      Feedback senden
    </Button>
  );

  return (
    <form
      className={classNames(
        className,
        "-mb-80 flex flex-col gap-8 print:hidden pt-24 pb-56",
      )}
      style={{
        backgroundColor: "#f4f4f4",
        boxShadow: "0 0 0 100vw #f4f4f4",
        clipPath: "inset(0 -100vw)",
      }}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h3>Helfen Sie uns den Elterngeldrechner zu verbessern.</h3>
      <div>
        <CustomRadioGroup
          className="mb-32 mt-16 max-w-[29rem]"
          legend={
            <b className="mb-16 block">
              Wie einfach war es für Sie den Elterngeldrechner zu nutzen?
            </b>
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
        <div className="pt-56">
          <CustomRadioGroup
            legend={
              <b className="mb-16 block">Was war die größte Schwierigkeit?</b>
            }
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
        <div className="py-56">
          <h4>Vielen Dank!</h4>
          <p className="font-bold">
            Ihr Feedback hilft uns, den Elterngeldrechner für alle Nutzenden zu
            verbessern!
          </p>
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
      <span className="absolute mt-80 whitespace-nowrap text-16" id={id}>
        {text}
      </span>
    );
  };
}

type Ease = 1 | 2 | 3 | 4 | 5;
