import { createSlice } from "@reduxjs/toolkit";

interface FeedbackState {
  submitted: boolean;
}

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState: { submitted: false },
  reducers: {
    submit: (state) => {
      state.submitted = true;
    },
  },
});

export const selectIsFeedbackSubmitted = (state: {
  feedback: FeedbackState;
}) => {
  return state.feedback.submitted;
};
