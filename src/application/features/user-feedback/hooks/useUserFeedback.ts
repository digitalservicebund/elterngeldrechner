import { useCallback } from "react";
import {
  feedbackSlice,
  selectIsFeedbackSubmitted,
} from "@/application/features/user-feedback/state";
import { useAppDispatch, useAppSelector } from "@/application/redux/hooks";

export function useUserFeedback() {
  const isFeebackSubmitted = useAppSelector(selectIsFeedbackSubmitted);

  const dispatch = useAppDispatch();
  const submitFeedback = useCallback(
    () => dispatch(feedbackSlice.actions.submit()),
    [dispatch],
  );

  return { isFeebackSubmitted, submitFeedback };
}
