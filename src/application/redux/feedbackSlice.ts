import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FeedbackState {
  submitted: boolean;
}

export const initialFeedbackState: FeedbackState = {
  submitted: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: initialFeedbackState,
  reducers: {
    configure: (_, action: PayloadAction<FeedbackState>) => {
      return action.payload;
    },
    submit: (state) => {
      state.submitted = true;
    },
  },
});

const selectSubmitted = (state: { feedback: FeedbackState }) => {
  return state.feedback.submitted;
};

export const feedbackSelectors = { selectSubmitted };

export const feedbackActions = feedbackSlice.actions;
export default feedbackSlice.reducer;
