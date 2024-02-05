import reducer, {
  initialStepRechnerState,
  StepRechnerState,
  stepRechnerActions,
} from "./stepRechnerSlice";

describe("stepRechnerSlice", () => {
  it("should create stepRechnerSlice with initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(
      initialStepRechnerState,
    );
  });
  it("should set hasBEGResultChangedDueToPrevFormSteps to true on action setHasBEGResultChangedDueToPrevFormSteps", () => {
    const previousState: StepRechnerState = {
      ...initialStepRechnerState,
      ET1: {
        ...initialStepRechnerState.ET1,
        elterngeldResult: {
          data: [],
          state: "success",
        },
      },
      ET2: {
        ...initialStepRechnerState.ET2,
        elterngeldResult: {
          data: [],
          state: "success",
        },
      },
    };

    expect(
      reducer(
        previousState,
        stepRechnerActions.setHasBEGResultChangedDueToPrevFormSteps({
          ET1: true,
          ET2: true,
        }),
      ),
    ).toEqual({
      ...previousState,
      ET1: {
        ...previousState.ET1,
        hasBEGResultChangedDueToPrevFormSteps: true,
      },
      ET2: {
        ...previousState.ET2,
        hasBEGResultChangedDueToPrevFormSteps: true,
      },
    });
  });
  it("should set hasBEGResultChangedDueToPrevFormSteps to false on action resetHasBEGResultChangedDueToPrevFormSteps", () => {
    const previousState: StepRechnerState = {
      ...initialStepRechnerState,
      ET1: {
        ...initialStepRechnerState.ET1,
        hasBEGResultChangedDueToPrevFormSteps: true,
        elterngeldResult: {
          data: [],
          state: "success",
        },
      },
      ET2: {
        ...initialStepRechnerState.ET2,
        hasBEGResultChangedDueToPrevFormSteps: true,
        elterngeldResult: {
          data: [],
          state: "success",
        },
      },
    };
    const action = {
      type: "stepRechner/resetHasBEGResultChangedDueToPrevFormSteps",
      payload: {
        elternteil: "ET1",
      },
    };

    expect(reducer(previousState, action)).toEqual({
      ...previousState,
      ET1: {
        ...previousState.ET1,
        hasBEGResultChangedDueToPrevFormSteps: false,
      },
    });
  });
});
